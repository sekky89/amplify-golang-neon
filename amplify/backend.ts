import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
// import { data } from "./data/resource";
import { apiHandler } from "./functions/resource";
import * as cdk from "aws-cdk-lib";
import * as agw from "aws-cdk-lib/aws-apigatewayv2";
import * as agwIntegration from "aws-cdk-lib/aws-apigatewayv2-integrations";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  // data,
  apiHandler,
});

const { lambda: apiLambda } = backend.apiHandler.resources;

const api = new agw.HttpApi(backend.stack, "HttpApi", {
  apiName: "myHttpApi",
  corsPreflight: {
    allowMethods: [
      agw.CorsHttpMethod.GET,
      agw.CorsHttpMethod.POST,
      agw.CorsHttpMethod.PUT,
      agw.CorsHttpMethod.DELETE,
    ],
    allowOrigins: ["*"],
    allowHeaders: ["*"],
  },
  createDefaultStage: true,
});

const apiIntegration = new agwIntegration.HttpLambdaIntegration("ApiIntegration", apiLambda);

api.addRoutes({
  path: "/{proxy+}",
  methods: [agw.HttpMethod.ANY],
  integration: apiIntegration,
});

backend.addOutput({
  custom: {
    API: {
      [api.httpApiName!]: {
        endpoint: api.url,
        region: cdk.Stack.of(api).region,
        apiName: api.httpApiName,
      },
    },
  },
});
