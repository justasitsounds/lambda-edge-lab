TAGS:="purpose=lab project=lambda-edge-ab"
EDGE_STACK = lambda-edge-dist
ORIGIN_STACK = lambda-edge-origins
CLOUDFRONT_TEMPLATE = cloudfront-template.yml
ORIGIN_TEMPLATE = ../content/origin-template.yml
OAI:=$(shell aws cloudformation describe-stacks --stack-name $(EDGE_STACK) --region us-east-1 --query 'Stacks[0].Outputs[?OutputKey==`OaiS3CanonicalUserId`].OutputValue[]' --output text)
RAND:=$$RANDOM
include rand.mk
ORIGIN_A:=ab-test-a-$(RAND)
ORIGIN_B:=ab-test-b-$(RAND)
DISTROBUCKET:=aws-sam-cli-managed-default-samclisourcebucket-$(RAND)
DISTRIBUTION_ID:=$(shell aws cloudformation describe-stacks --stack-name $(EDGE_STACK) --region us-east-1 --query 'Stacks[0].Outputs[?OutputKey==`DistributionID`].OutputValue[]' --output text)

.PHONY: deploy-clicktracker upload-origin upload-index invalidate-cache clean package deploy-distribution deploy-origins teardown-origins setup reset

rand.mk:
	@echo "RAND:=$$RANDOM" > rand.mk 

test:
	@echo $(RAND)

upload-index:
	aws s3api put-object --bucket $(ORIGIN_A) --content-type text/html --cache-control max-age=60 --key index.html --body ./content/origin-a/index.html
	aws s3api put-object --bucket $(ORIGIN_B) --content-type text/html --cache-control max-age=60 --key index.html --body ./content/origin-b/index.html

invalidate-cache:
	aws cloudfront create-invalidation --distribution-id $(DISTRIBUTION_ID) --paths "/*" 

distrobucket:
	aws s3api create-bucket --bucket $(DISTROBUCKET) --acl private --region us-east-1
	aws s3api put-bucket-policy --bucket $(DISTROBUCKET) --policy '{ "Version": "2008-10-17", "Statement": [ { "Effect": "Allow", "Principal": { "Service": "serverlessrepo.amazonaws.com" }, "Action": "s3:GetObject", "Resource": "arn:aws:s3:::$(DISTROBUCKET)/*" } ] }'

deploy-distribution: ../edge-functions/src/origins_config.js 
	sam deploy --template-file $(CLOUDFRONT_TEMPLATE) --tags $(TAGS) --stack-name $(EDGE_STACK) --s3-bucket $(DISTROBUCKET) --parameter-overrides "randomSeed=$(RAND)"

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
