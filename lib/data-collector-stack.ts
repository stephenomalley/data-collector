import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as fs from "fs";
import * as path from "node:path";
import * as iam from "aws-cdk-lib/aws-iam";

export class DataCollectorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const dataCollector: string = "protocol.min.js";

    // Create an S3 bucket
    const bucket = new s3.Bucket(this, "ProtocolCollector", {
      versioned: true,
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create an Origin Access Identity for CloudFront
    const oai = new cloudfront.OriginAccessIdentity(this, "ProtocolOAI", {
      comment: "OAI for connection to S3 bucket.",
    });

    // Create a CloudFront distribution with the OAI and S3 bucket as the origin
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "ProtocolDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity: oai,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      },
    );

    // Update the S3 bucket policy to only allow access from CloudFront
    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [bucket.arnForObjects("*")],
        principals: [
          new iam.CanonicalUserPrincipal(
            oai.cloudFrontOriginAccessIdentityS3CanonicalUserId,
          ),
        ],
      }),
    );

    // Upload a file to S3 and make it accessible via CloudFront
    new s3deploy.BucketDeployment(this, "DeployScript", {
      sources: [
        s3deploy.Source.data(
          dataCollector,
          fs
            .readFileSync(
              path.resolve(__dirname, "..", "out", "protocol.min.js"),
            )
            .toString(),
        ),
      ],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ["/*"],
    });

    // Output the CloudFront Distribution URL
    new cdk.CfnOutput(this, "DistributionURL", {
      value: distribution.distributionDomainName,
    });
  }
}
