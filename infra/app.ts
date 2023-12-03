#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { IAMStack } from "./stacks/iam-stack";
import {
  APPLICATION_ID,
  AWS_ACCOUNT_ID,
  AWS_REGION,
  ENVIRONMENT,
  PREFIX,
} from "./env";
import { ECRStack } from "./stacks/ecr-stack";
import { ECSStack } from "./stacks/ecs-stack";

const tags = {
  "company:application-id": APPLICATION_ID,
  "company:environment": ENVIRONMENT,
};
const env = { account: `${AWS_ACCOUNT_ID}`, region: `${AWS_REGION}` };

const app = new cdk.App();
new IAMStack(app, "IAMStack", {
  stackName: `${PREFIX}-iam-stack`,
  tags: tags,
  env,
});

new ECRStack(app, "ECRStack", {
  stackName: `${PREFIX}-ecr-stack`,
  tags: tags,
  env,
});

new ECSStack(app, "ECSStack", {
  stackName: `${PREFIX}-ecs-stack`,
  tags: tags,
  env,
});
