# Lambda@Edge Lab : A/B testing wiht lambda@edge

Resources: 
    -   https://aws.amazon.com/getting-started/projects/build-modern-app-fargate-lambda-dynamodb-python/module-five/
    -   https://apimeister.com/2017/08/24/integrate-api-gateway-with-kinesis-firehose-using-cloudformation.html
    -   https://techblog.realtor.com/a-b-testing-with-lambdaedge-and-cloudfront/
    -   https://medium.com/buildit/a-b-testing-on-aws-cloudfront-with-lambda-edge-a22dd82e9d12j
    -   https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
    -   https://github.com/awslabs/aws-cloudformation-templates/blob/master/community/solutions/StaticS3CloudFront.yml
    


## testing clicktracker

curl -X PUT https://b4ifx87owb.execute-api.ap-southeast-2.amazonaws.com/prod/clicks -d "{\"key\":\"value\"}" -H "Content-Type:application/json"

aws-apac-anz-sales-mmt-nsw03