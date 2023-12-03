import { App, Stack, StackProps, Fn, Duration } from "aws-cdk-lib";
import { Subnet, Vpc } from "aws-cdk-lib/aws-ec2";
import { Cluster, ContainerImage, Secret as sec } from "aws-cdk-lib/aws-ecs";
import { ApplicationLoadBalancer } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { Role } from "aws-cdk-lib/aws-iam";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import {
  AWS_ACCOUNT_ID,
  AWS_REGION,
  AWS_VPC_ID,
  IMAGE_TAG,
  PREFIX,
} from "../env";

export class ECSStack extends Stack {
  constructor(scope: App, id: string, props: StackProps) {
    super(scope, id, props);

    // 👇 Importing AWS Secret using Name
    // const secret = Secret.fromSecretNameV2(
    //   this,
    //   "SecretFromName",
    //   `${PREFIX}-env-vars`
    // );

    // 👇 Importing existing VPC and Public/Private Subnets using Import function
    // const vpc = Vpc.fromLookup(this, "vpc", {
    //   vpcId: AWS_VPC_ID,
    // });

    // 👇 Importing existing hosted zone in route53 using lookup function
    // const zone = HostedZone.fromLookup(this, "Zone", {
    //   domainName: `${domainName}`,
    // });

    // 👇 ECS cluster creation
    // const cluster = new Cluster(this, "Cluster", {
    //   clusterName: `${PREFIX}`,
    // });

    // Domain name for ECS App
    // const domain = `${processId}.${environment}.${domainName}`;

    // 👇 SSL certificate creation
    // const certificate = Certificate.fromCertificateArn(
    //   this,
    //   "SubSubDomainsCertificate",
    //   certificateArn as string
    // );

    // 👇 Deploy fargate to ECS
    const loadBalancedFargateService =
      new ApplicationLoadBalancedFargateService(this, "Service", {
        desiredCount: 1,
        serviceName: `${PREFIX}`,
        publicLoadBalancer: true,
        loadBalancerName: `${PREFIX}`,
        // domainName: domain,
        // domainZone: zone,
        // certificate,
        // redirectHTTP: true,
        // Cpu: default: 256
        // memoryLimitMiB: default: 512
        // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.FargateTaskDefinition.html
        // memoryLimitMiB: memory_spec ? Number(memory_spec) : undefined,
        // cpu: cpu_spec ? Number(cpu_spec) : undefined,
        taskImageOptions: {
          family: `${PREFIX}-ecs-taskdef`,
          image: ContainerImage.fromRegistry(
            `${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${PREFIX}:${IMAGE_TAG}`
          ),
          containerPort: 3000,
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
          environment: {
            PORT: "3000",
          },
          // secrets: {
          //   APM_APP_ID: sec.fromSecretsManager(secret, "APM_APP_ID"),
          //   APM_APP_SECRET: sec.fromSecretsManager(secret, "APM_APP_SECRET"),
          //   APM_OPTIONS_ENDPOINT: sec.fromSecretsManager(
          //     secret,
          //     "APM_OPTIONS_ENDPOINT"
          //   ),
          //   COGNITO_CLIENT_ID: sec.fromSecretsManager(
          //     secret,
          //     "COGNITO_CLIENT_ID"
          //   ),
          //   COGNITO_CLIENT_SECRET: sec.fromSecretsManager(
          //     secret,
          //     "COGNITO_CLIENT_SECRET"
          //   ),
          //   COGNITO_DOMAIN_URL: sec.fromSecretsManager(
          //     secret,
          //     "COGNITO_DOMAIN_URL"
          //   ),
          //   COGNITO_USER_POOL_ID: sec.fromSecretsManager(
          //     secret,
          //     "COGNITO_USER_POOL_ID"
          //   ),
          //   METEOR_SETTINGS: sec.fromSecretsManager(secret, "METEOR_SETTINGS"),
          //   MONGO_URL: sec.fromSecretsManager(secret, "MONGO_URL"),
          //   MONGO_OPLOG_URL: sec.fromSecretsManager(secret, "MONGO_OPLOG_URL"),
          //   ROOT_URL: sec.fromSecretsManager(secret, "ROOT_URL"),
          //   DOCUSIGN_CREDENTIALS: sec.fromSecretsManager(
          //     secret,
          //     "DOCUSIGN_CREDENTIALS"
          //   ),
          //   WQT_JWT_SECRET: sec.fromSecretsManager(secret, "WQT_JWT_SECRET"),
          //   ESA_CALCULATOR_JWT_SECRET: sec.fromSecretsManager(
          //     secret,
          //     "ESA_CALCULATOR_JWT_SECRET"
          //   ),
          // },
        },
      });

    // 👇 Target group helth check configurations
    loadBalancedFargateService.targetGroup.configureHealthCheck({
      path: "/",
      healthyHttpCodes: "200-499",
      interval: Duration.seconds(5),
      unhealthyThresholdCount: 2,
      timeout: Duration.seconds(4),
      healthyThresholdCount: 2,
    });
  }
}
