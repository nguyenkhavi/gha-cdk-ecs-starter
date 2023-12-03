import {
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { Cluster, ContainerImage, Secret as sec } from "aws-cdk-lib/aws-ecs";
import { ApplicationMultipleTargetGroupsFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import { ApplicationProtocol } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { Role } from "aws-cdk-lib/aws-iam";

import { Construct } from "constructs";
import { AWS_ACCOUNT_ID, AWS_REGION, IMAGE_TAG, PREFIX } from "../env";

export class ECSStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 👇 Importing existing VPC and Public/Private Subnets using Import function
    // const vpc = Vpc.fromLookup(this, "vpc", {
    //   vpcId,
    // });

    // 👇 ECS cluster creation
    const cluster = new Cluster(this, "Cluster", {
      clusterName: `${PREFIX}`,
    });

    // 👇 Deploy fargate to ECS
    const loadBalancedFargateService =
      new ApplicationMultipleTargetGroupsFargateService(this, "Service", {
        cluster,
        assignPublicIp: true,
        desiredCount: 1,
        serviceName: `${PREFIX}`,
        loadBalancers: [
          {
            name: `${PREFIX}`,
            publicLoadBalancer: true,
            // vpc,
            // securityGroup: albSG,
            // internetFacing: true,
            listeners: [
              {
                name: "listener-80",
                protocol: ApplicationProtocol.HTTP,
                port: 80,
              },
              {
                name: "listener-7007",
                protocol: ApplicationProtocol.HTTP,
                port: 7007,
              },
              {
                name: "listener-11011",
                protocol: ApplicationProtocol.HTTP,
                port: 11011,
              },
            ],
          },
        ],
        // Cpu: default: 256
        // memoryLimitMiB: default: 512
        // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.FargateTaskDefinition.html

        taskImageOptions: {
          family: `${PREFIX}-ecs-taskdef`,
          image: ContainerImage.fromRegistry(
            `${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${PREFIX}:${IMAGE_TAG}`
          ),
          containerPorts: [80, 7007, 11011],
          containerName: "app",
          executionRole: Role.fromRoleName(
            this,
            "exec-role",
            `${PREFIX}-ecs-task-execution`
          ),
          taskRole: Role.fromRoleName(
            this,
            "task-role",
            `${PREFIX}-ecs-task-role`
          ),
          // secrets: {
          //   MONGO_OPLOG_URL: sec.fromSecretsManager(secret, "MONGO_OPLOG_URL"),
          //   MONGO_URL: sec.fromSecretsManager(secret, "MONGO_URL"),
          //   PORT: sec.fromSecretsManager(secret, "PORT"),
          //   ROOT_URL: sec.fromSecretsManager(secret, "ROOT_URL"),
          //   METRICS_RETENTION_DAYS: sec.fromSecretsManager(
          //     secret,
          //     "METRICS_RETENTION_DAYS"
          //   ),
          // },
        },
        targetGroups: [
          {
            containerPort: 80,
            listener: "listener-80",
          },
          {
            containerPort: 7007,
            listener: "listener-7007",
          },
          {
            containerPort: 11011,
            listener: "listener-11011",
          },
        ],
      });

    loadBalancedFargateService.targetGroups.forEach((targetGroup) => {
      targetGroup.configureHealthCheck({
        path: "/",
        port: "80",
        healthyHttpCodes: "200",
        interval: Duration.seconds(10),
        unhealthyThresholdCount: 2,
        timeout: Duration.seconds(8),
        healthyThresholdCount: 2,
      });
    });
  }
}
