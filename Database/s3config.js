const { S3Client } = require("@aws-sdk/client-s3");

exports.s3client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.S3_CLIENT_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_CLIENT_SECRET_KEY_ID,
  },
});
