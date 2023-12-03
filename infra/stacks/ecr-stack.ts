import { App, Stack, StackProps } from "aws-cdk-lib";
import { RemovalPolicy } from "aws-cdk-lib";
import { Repository } from "aws-cdk-lib/aws-ecr";
import { ArnPrincipal, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { AWS_ACCOUNT_ID, PREFIX } from "../env";

export class ECRStack extends Stack {
  constructor(scope: App, id: string, props: StackProps) {
    super(scope, id, props);

    // 👇 ECR repository creation
    const repo = new Repository(this, "ecr-repository", {
      repositoryName: `${PREFIX}`,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteImages: true,
    });

    const policy = new PolicyStatement();
    policy.addPrincipals(
      new ArnPrincipal(
        `arn:aws:iam::${AWS_ACCOUNT_ID}:role/${PREFIX}-ecs-task-execution`
      )
    );
    policy.addActions(
      "ecr:BatchGetImage",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer"
    );
    repo.addToResourcePolicy(policy);
  }
}
