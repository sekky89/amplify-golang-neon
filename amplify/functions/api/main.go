package main

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"
)

type Event struct {
	Arguments Arguments `json:"arguments"`
}

type Arguments struct {
	Title string `json:"phone"`
	Msg   string `json:"msg"`
}

func HandleRequest(ctx context.Context, event Event) (string, error) {
	fmt.Println("Received event: ", event)

	// fmt.Println("Message sent to: ", event.Arguments.Msg)
	// You can use lambda arguments in your code

	return "Hello World!", nil
}

func main() {
	lambda.Start(HandleRequest)
}
