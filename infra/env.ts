const {
  AWS_REGION = "",
  AWS_ACCOUNT_ID = "",
  APPLICATION_ID = "",
  ENVIRONMENT = "",
  AWS_VPC_ID = "",
  IMAGE_TAG = "",
} = process.env;

export {
  AWS_REGION,
  AWS_ACCOUNT_ID,
  APPLICATION_ID,
  ENVIRONMENT,
  AWS_VPC_ID,
  IMAGE_TAG,
};
export const PREFIX = `${APPLICATION_ID}-${ENVIRONMENT}`;
