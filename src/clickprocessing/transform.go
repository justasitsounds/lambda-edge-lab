package main

import (
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

// Lambda function handler
func handleRequest(evnt events.KinesisFirehoseEvent) (events.KinesisFirehoseResponse, error) {
	var response events.KinesisFirehoseResponse

	for _, record := range evnt.Records {
		fmt.Printf("RecordID: %s\n", record.RecordID)
		fmt.Printf("ApproximateArrivalTimestamp: %s\n", record.ApproximateArrivalTimestamp)
		fmt.Printf("Data: %s\n", string(record.Data[:]))

		// Transform data: ToUpper the data
		var transformedRecord events.KinesisFirehoseResponseRecord
		transformedRecord.RecordID = record.RecordID
		transformedRecord.Result = events.KinesisFirehoseTransformedStateOk
		transformedRecord.Data = record.Data

		response.Records = append(response.Records, transformedRecord)
	}

	fmt.Println(response) // Or should this be log.Println???

	return response, nil
}

func main() {
	lambda.Start(handleRequest)
}
