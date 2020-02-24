TAGS:="purpose=lab project=lambda-edge-ab"
EDGE_STACK = lambda-edge-ab
CLOUDFRONT_TEMPLATE = cloudfront-template.yml
ORIGIN_TEMPLATE = ./content/origin-template.yml

.PHONY: deploy-clicktracker upload-origin upload-index invalidate-cache clean package deploy-distribution

clean:
	rm -rf dist/
	rm -f clickstream.zip

clickstream.zip: dist/transform
	zip clickstream.zip $<

dist/transform: clean
	env GOOS=linux GOARCH=amd64 go build -o $@ github.com/justasitsounds/lambda-edge-lab/src/clickprocessing

deploy-clicktracker: clickstream.zip
	sam deploy --template-file ./cfn/clickstream.yml --tags $(TAGS)

upload-origin:
	aws s3 cp ./content/origin-a/ s3://ab-test-a --recursive
	aws s3 cp ./content/origin-b/ s3://ab-test-b --recursive

upload-index:
	aws s3api put-object --bucket ab-test-a --content-type text/html --cache-control maxage=0 --key index.html --body ./content/origin-a/index.html
	aws s3api put-object --bucket ab-test-b --content-type text/html --cache-control maxage=0 --key index.html --body ./content/origin-b/index.html

invalidate-cache:
	aws cloudfront create-invalidation --distribution-id $(DISTRIBUTIONID) --paths "/index.html" 

deploy-distribution:
	sam deploy --template-file $(CLOUDFRONT_TEMPLATE) --tags $(TAGS)
	# aws cloudformation deploy --stack-name $(EDGE_STACK) --template $(EDGE_STACK_TEMPLATE) --capabilities CAPABILITY_IAM --tags $(TAGS)

deploy-edgefuncs:
	sam deploy --template-file $(ORIGIN_TEMPLATE) --tags $(TAGS) -g