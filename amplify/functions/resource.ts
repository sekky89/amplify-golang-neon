import cdk from "aws-cdk-lib";
import * as lmd from "aws-cdk-lib/aws-lambda";
import { defineFunction } from "@aws-amplify/backend";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const functionDir = path.dirname(fileURLToPath(import.meta.url));

export const apiHandler = defineFunction(
  (scope) =>
    new lmd.Function(scope, "API", {
      handler: "bootstrap",
      runtime: lmd.Runtime.PROVIDED_AL2023,
      timeout: cdk.Duration.seconds(5),
      architecture: lmd.Architecture.ARM_64,
      code: lmd.Code.fromAsset(functionDir, {
        bundling: {
          image: cdk.DockerImage.fromRegistry("dummy"),
          local: {
            tryBundle(outputDir: string) {
              execSync(
                `cd ${functionDir}/api && GOARCH=arm64 GOOS=linux CGO_ENABLED=0 go build -tags lambda.norpc -o ${path.join(outputDir)}/bootstrap main.go`,
              );
              return true;
            },
          },
        },
      }),
      layers: [
        lmd.LayerVersion.fromLayerVersionArn(
          scope,
          "LambdaWebAdapter",
          "arn:aws:lambda:ap-northeast-1:753240598075:layer:LambdaAdapterLayerArm64:25",
        ),
      ],
      environment: {
        PORT: "8000",
      },
      loggingFormat: lmd.LoggingFormat.JSON,
    }),
);
