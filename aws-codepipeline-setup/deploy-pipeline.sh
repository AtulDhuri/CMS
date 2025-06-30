#!/bin/bash

# AWS CodePipeline Deployment Script
# This script sets up the complete CI/CD pipeline for the Angular CMS application

set -e

# Configuration
STACK_NAME="cms-pipeline"
REGION="ap-south-1"
GITHUB_OWNER="your-github-username"
GITHUB_REPO="surveyPopupFE"
GITHUB_BRANCH="main"

echo "🚀 Starting CodePipeline deployment..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS credentials verified"

# Create S3 bucket for CloudFormation templates (if it doesn't exist)
BUCKET_NAME="cms-pipeline-templates-$(aws sts get-caller-identity --query Account --output text)"
echo "📦 Creating S3 bucket for templates: $BUCKET_NAME"

if ! aws s3 ls "s3://$BUCKET_NAME" &> /dev/null; then
    aws s3 mb "s3://$BUCKET_NAME" --region $REGION
    aws s3api put-bucket-versioning --bucket $BUCKET_NAME --versioning-configuration Status=Enabled
    echo "✅ S3 bucket created"
else
    echo "✅ S3 bucket already exists"
fi

# Upload CloudFormation template
echo "📤 Uploading CloudFormation template..."
aws s3 cp pipeline-template.yaml "s3://$BUCKET_NAME/pipeline-template.yaml"

# Deploy CloudFormation stack
echo "🏗️ Deploying CloudFormation stack..."
aws cloudformation deploy \
    --template-url "https://$BUCKET_NAME.s3.$REGION.amazonaws.com/pipeline-template.yaml" \
    --stack-name $STACK_NAME \
    --parameter-overrides \
        GitHubOwner=$GITHUB_OWNER \
        GitHubRepo=$GITHUB_REPO \
        GitHubBranch=$GITHUB_BRANCH \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $REGION

echo "✅ CloudFormation stack deployed successfully"

# Get the CodeStar Connection ARN
CONNECTION_ARN=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`CodeStarConnectionArn`].OutputValue' \
    --output text)

echo "🔗 CodeStar Connection ARN: $CONNECTION_ARN"

# Instructions for completing the setup
echo ""
echo "🎉 Pipeline setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Go to AWS CodePipeline console"
echo "2. Find your pipeline: $STACK_NAME-pipeline"
echo "3. Click on 'Source' stage and complete the GitHub connection"
echo "4. Authorize the connection with your GitHub account"
echo "5. The pipeline will automatically trigger on code changes"
echo ""
echo "🔗 Pipeline URL: https://$REGION.console.aws.amazon.com/codesuite/codepipeline/pipelines/$STACK_NAME-pipeline/view"
echo "🔗 CodeBuild URL: https://$REGION.console.aws.amazon.com/codesuite/codebuild/projects/$STACK_NAME-build/history"
echo ""
echo "💡 To test the pipeline:"
echo "   git add ."
echo "   git commit -m 'Test pipeline deployment'"
echo "   git push origin $GITHUB_BRANCH" 