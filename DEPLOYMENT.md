# CI/CD Pipeline Setup

This repository includes a GitHub Actions workflow for automated build, test, and deployment to AWS S3.

## Required GitHub Secrets

To enable the CI/CD pipeline, you need to configure the following secrets in your GitHub repository:

### Navigate to Repository Settings > Secrets and variables > Actions

Add these repository secrets:

1. **`API_URL`** - The full URL for the user creation API endpoint
   - Example: `https://api.yourproject.com/users`

2. **`AWS_ACCESS_KEY_ID`** - AWS access key for deployment
   - Create an IAM user with S3 permissions and use its access key ID

3. **`AWS_SECRET_ACCESS_KEY`** - AWS secret key for deployment
   - The secret access key for the same IAM user

4. **`AWS_S3_BUCKET_NAME`** - Target S3 bucket name for deployment
   - Example: `my-app-production-bucket`

## IAM Permissions Required

The IAM user should have the following permissions for the S3 bucket:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::YOUR_BUCKET_NAME",
                "arn:aws:s3:::YOUR_BUCKET_NAME/*"
            ]
        }
    ]
}
```

## Workflow Trigger

The workflow automatically triggers on:
- Push to the `main` branch

## Build Process

1. **Install Dependencies**: `npm install`
2. **Run Tests**: `npm run test`
3. **Build Application**: `npm run build` with environment variables
4. **Deploy to S3**: Sync the `dist` folder to the configured S3 bucket

## Environment Variables

The build process uses the following environment variables:
- `VITE_API_URL` - Set from the `API_URL` secret during build

## AWS S3 Configuration

The deployed files will be synced to the root of the specified S3 bucket with the `--delete` flag, which removes files that are no longer in the source.

Make sure your S3 bucket is configured for static website hosting if you want to serve the application directly from S3.