# AWS CDK Node.js App with GitHub Actions

[![GitHub Actions Status](https://github.com/nguyenkhavi/gha-cdk-ecs-starter/actions/workflows/dev.yaml/badge.svg)](https://github.com/nguyenkhavi/gha-cdk-ecs-starter/actions)

## Overview

This project is a Node.js application deployed to AWS ECS using AWS CDK. It demonstrates a basic CI/CD pipeline using GitHub Actions for continuous integration, Docker for containerization, and AWS CDK for infrastructure as code.

## Prerequisites

### IAM Role for GitHub Actions

Create an IAM role in the AWS Management Console that GitHub Actions can assume when deploying resources (Ex: `github-actions-role`).
Note the Role ARN; you will use it as a variable in the GitHub repository.

### GitHub Repository Vars (or Secrets)

In your GitHub repository, add the following secrets:

- `APPLICATION_ID`: Your internal application id.
- `AWS_ACCOUNT_ID`: Your AWS account id.
- `AWS_REGION`: The AWS region where your ECS cluster is located.
- `AWS_ROLE`: The ARN of the IAM role created for GitHub Actions.

### IAM Trust Relationship

Ensure the IAM role created has a trust relationship with GitHub Actions. This can be done by updating the trust policy with the GitHub Actions account ID.

1. In the IAM console, select the IAM role created for GitHub Actions.

2. Under the "Trust relationships" tab, click "Edit trust relationship."

3. Update the JSON document with the GitHub Actions account ID:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "Federated": "arn:aws:iam::<account-id>:oidc-provider/token.actions.githubusercontent.com"
         },
         "Action": "sts:AssumeRoleWithWebIdentity",
         "Condition": {
           "StringLike": {
             "token.actions.githubusercontent.com:sub": "repo:<github-username>/<github-repo>:*",
             "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
           }
         }
       }
     ]
   }
   ```

4. Follow [these steps](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html) to add the GitHub OIDC provider to IAM. For the provider URL: Use https://token.actions.githubusercontent.com and use `sts.amazonaws.com` for the "Audience" if you are using the [official action](https://github.com/aws-actions/configure-aws-credentials).

## Project Structure

```
├── src/              # Source code
├── infra/            # AWS CDK scripts for defining infrastructure
├── Dockerfile        # Docker configuration for containerizing the source code
├── ...
```

- src: Contains the Node.js application logic.
- infra: Contains AWS CDK scripts for defining infrastructure.
- Dockerfile: Docker configuration for containerizing the source code.

## Customization

### Changing Source Code

The source code is located in the src/ directory. Customize the Node.js application logic to meet your specific requirements.

### Adapting Dockerfile

The Dockerfile (Dockerfile) in the root directory defines the configuration for containerizing your source code. Modify the Dockerfile as needed to ensure compatibility with your application.

### Customizing AWS CDK Scripts

The AWS CDK scripts are located in the infra directory. Customize the scripts in infra to define your AWS infrastructure according to your requirements.
