TAGS:="purpose=lab project=lambda-edge-ab"
EDGE_STACK = lambda-edge-dist
ORIGIN_STACK = lambda-edge-origins
CLOUDFRONT_TEMPLATE = cloudfront-template.yml
ORIGIN_TEMPLATE = ../content/origin-template.yml
OAI:=$(shell aws cloudformation describe-stacks --stack-name $(EDGE_STACK) --region us-east-1 --query 'Stacks[0].Outputs[?OutputKey==`OaiS3CanonicalUserId`].OutputValue[]' --output text)
RAND:=$$RANDOM
# ORIGIN_A:=ab-test-a-$(RAND)
# ORIGIN_B:=ab-test-b-$(RAND)
ORIGIN_A:=ab-test-a-11303
ORIGIN_B:=ab-test-b-16205
DISTRIBUTION_ID:=$(shell aws cloudformation describe-stacks --stack-name $(EDGE_STACK) --region us-east-1 --query 'Stacks[0].Outputs[?OutputKey==`DistributionID`].OutputValue[]' --output text)

.PHONY: deploy-clicktracker upload-origin upload-index invalidate-cache clean package deploy-distribution deploy-origins teardown-origins setup reset

clean:
	rm -rf dist/
	rm -f clickstream.zip

clickstream.zip: dist/transform
	zip clickstream.zip $<

dist/transform: clean
	env GOOS=linux GOARCH=amd64 go build -o $@ github.com/justasitsounds/lambda-edge-lab/src/clickprocessing

deploy-clicktracker: clickstream.zip
	sam deploy --template-file ../cfn/clickstream.yml --tags $(TAGS)

upload-index:
	aws s3api put-object --bucket ab-test-a --content-type text/html --cache-control max-age=60 --key index.html --body ./content/origin-a/index.html
	aws s3api put-object --bucket ab-test-b --content-type text/html --cache-control max-age=60 --key index.html --body ./content/origin-b/index.html

invalidate-cache:
	aws cloudfront create-invalidation --distribution-id $(DISTRIBUTION_ID) --paths "/*" 

deploy-distribution: ../edge-functions/src/origins_config.js 
	sam deploy --template-file $(CLOUDFRONT_TEMPLATE) --tags $(TAGS) --stack-name $(EDGE_STACK) 

deploy-origins:
	sam deploy --template-file $(ORIGIN_TEMPLATE) --tags $(TAGS) --stack-name $(ORIGIN_STACK) --parameter-overrides "OriginAccessIdentity=$(OAI) OriginA=$(ORIGIN_A).s3.ap-southeast-2.amazonaws.com OriginB=$(ORIGIN_B).s3.ap-southeast-2.amazonaws.com"

../edge-functions/src/origins_config.js:
	@echo "module.exports = {\n  a:'$(ORIGIN_A)',\n  b:'$(ORIGIN_B)'\n};\n" > $@

teardown-origins:
	aws s3 rb s3://$(ORIGIN_A) --force
	aws s3 rb s3://$(ORIGIN_B) --force
	aws cloudformation wait stack-delete-complete --stack-name $(ORIGIN_STACK)

setup: deploy-distribution
	@echo "LAB SET UP"

reset: teardown-origins invalidate-cache 
	@echo "LAB RESET"
