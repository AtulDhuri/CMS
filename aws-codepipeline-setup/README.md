# AWS CodePipeline Setup for Angular CMS

This guide will help you set up a complete CI/CD pipeline for your Angular CMS application using AWS CodePipeline, CodeBuild, and S3.

## 📋 Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **GitHub Repository** with your Angular code
4. **GitHub Personal Access Token** (if using token-based authentication)

## 🚀 Quick Setup

### Step 1: Update Configuration

Edit `deploy-pipeline.sh` and update these variables:
```bash
GITHUB_OWNER="your-github-username"
GITHUB_REPO="surveyPopupFE"
GITHUB_BRANCH="main"
REGION="ap-south-1"
```

### Step 2: Run Deployment Script

```bash
cd aws-codepipeline-setup
chmod +x deploy-pipeline.sh
./deploy-pipeline.sh
```

### Step 3: Complete GitHub Connection

1. Go to AWS CodePipeline console
2. Find your pipeline: `cms-pipeline-pipeline`
3. Click on the **Source** stage
4. Click **Edit** → **Edit source**
5. Click **Connect to GitHub**
6. Authorize the connection
7. Select your repository and branch
8. Save changes

## 📁 File Structure

```
aws-codepipeline-setup/
├── pipeline-template.yaml    # CloudFormation template
├── deploy-pipeline.sh        # Deployment script
├── iam-roles.json           # IAM roles configuration
└── README.md                # This file
```

## 🔧 Manual Setup (Alternative)

If you prefer manual setup, follow these steps:

### 1. Create IAM Roles

```bash
aws iam create-role --role-name CodePipelineServiceRole --assume-role-policy-document file://iam-roles.json
aws iam create-role --role-name CodeBuildServiceRole --assume-role-policy-document file://iam-roles.json
```

### 2. Create CodeBuild Project

```bash
aws codebuild create-project \
    --name cms-build \
    --source type=CODEPIPELINE,buildspec=buildspec.yml \
    --artifacts type=CODEPIPELINE \
    --environment type=LINUX_CONTAINER,computeType=BUILD_GENERAL1_SMALL,image=aws/codebuild/amazonlinux2-x86_64-standard:4.0 \
    --service-role CodeBuildServiceRole
```

### 3. Create CodePipeline

```bash
aws codepipeline create-pipeline \
    --pipeline-name cms-pipeline \
    --pipeline-definition file://pipeline-definition.json
```

## 🔍 Pipeline Stages

1. **Source**: Fetches code from GitHub
2. **Build**: Builds Angular application using CodeBuild
3. **Deploy**: Deploys to S3 bucket

## 📊 Monitoring

### View Pipeline Status
```bash
aws codepipeline get-pipeline-state --name cms-pipeline
```

### View Build Logs
```bash
aws codebuild batch-get-builds --ids <build-id>
```

### CloudWatch Logs
- Log Group: `/aws/codebuild/cms-build`
- Log Stream: `<build-id>`

## 🛠️ Troubleshooting

### Common Issues

1. **GitHub Connection Failed**
   - Ensure GitHub Personal Access Token has correct permissions
   - Check if the repository is private/public

2. **Build Failed**
   - Check `buildspec.yml` syntax
   - Verify Node.js version compatibility
   - Check S3 bucket permissions

3. **Deployment Failed**
   - Verify S3 bucket exists and is accessible
   - Check IAM permissions for S3 operations

### Debug Commands

```bash
# Check pipeline status
aws codepipeline get-pipeline-state --name cms-pipeline

# List recent builds
aws codebuild list-builds --project-name cms-build

# Get build details
aws codebuild batch-get-builds --ids <build-id>

# Check CloudFormation stack
aws cloudformation describe-stacks --stack-name cms-pipeline
```

## 🔒 Security Considerations

1. **IAM Roles**: Use least privilege principle
2. **S3 Bucket**: Enable versioning and encryption
3. **GitHub Token**: Use fine-grained permissions
4. **CloudTrail**: Enable for audit logging

## 📈 Scaling

### Performance Optimization

1. **Build Cache**: Enable CodeBuild cache
2. **Parallel Builds**: Use multiple build projects
3. **Artifact Optimization**: Compress artifacts

### Cost Optimization

1. **Build Time**: Optimize build process
2. **Instance Type**: Use appropriate compute type
3. **S3 Lifecycle**: Set up lifecycle policies

## 🔄 Updates

To update the pipeline:

1. Modify `pipeline-template.yaml`
2. Run deployment script again
3. CloudFormation will update the stack

## 📞 Support

For issues:
1. Check AWS CloudWatch logs
2. Review CodeBuild build logs
3. Verify IAM permissions
4. Check GitHub connection status

## 📚 Additional Resources

- [AWS CodePipeline Documentation](https://docs.aws.amazon.com/codepipeline/)
- [AWS CodeBuild Documentation](https://docs.aws.amazon.com/codebuild/)
- [CloudFormation Documentation](https://docs.aws.amazon.com/cloudformation/)
- [GitHub Integration Guide](https://docs.aws.amazon.com/codepipeline/latest/userguide/connections-github.html) 