import {
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AWS_ACCOUNT_ID, AWS_REGION, PREFIX } from "../env";

export class IAMStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // 👇 Task execution role creation
    const taskExecutionRole = new Role(this, "TaskExecutionRole", {
      assumedBy: new ServicePrincipal("ecs-tasks.amazonaws.com"),
      roleName: `${PREFIX}-ecs-task-execution`,
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AmazonECSTaskExecutionRolePolicy"
        ),
      ],
    });

    taskExecutionRole.addToPolicy(
      new PolicyStatement({
        actions: ["secretsmanager:GetSecretValue"],
        resources: [
          `arn:aws:secretsmanager:${AWS_REGION}:${AWS_ACCOUNT_ID}:secret:${PREFIX}-env-vars:*`,
        ],
      })
    );

    // 👇 Task role creation
    new Role(this, "TaskRole", {
      assumedBy: new ServicePrincipal("ecs-tasks.amazonaws.com"),
      roleName: `${PREFIX}-ecs-task-role`,
    });
  }
}
