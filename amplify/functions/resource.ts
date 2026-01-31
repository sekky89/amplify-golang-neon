import cdk from "aws-cdk-lib";
import * as lmd from "aws-cdk-lib/aws-lambda";
import { defineFunction } from "@aws-amplify/backend";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const functionDir = path.dirname(fileURLToPath(import.meta.url));

const fnProps: Omit<lmd.FunctionProps, "code"> = {
  handler: "bootstrap",
  runtime: lmd.Runtime.PROVIDED_AL2023,
  timeout: cdk.Duration.seconds(5),
  architecture: lmd.Architecture.ARM_64,
};

export const apiHandler = defineFunction(
  (scope) =>
    new lmd.Function(scope, "api", {
      ...fnProps,
      code: lmd.Code.fromAsset(functionDir, {
        bundling: {
          image: cdk.DockerImage.fromRegistry("dummy"),
          local: {
            tryBundle(outputDir: string) {
              execSync(`rsync -rLv ${functionDir}/* ${path.join(outputDir)}`);
              execSync(
                `cd ${path.join(outputDir)}/api && GOARCH=amd64 GOOS=linux go build -tags lambda.norpc -o ${path.join(outputDir)}/bootstrap ${functionDir}/main.go`,
              );
              return true;
            },
          },
        },
      }),
    }),
);
