require('dotenv').config()
const AWS = require('aws-sdk');
// Configure AWS SDK with DigitalOcean Spaces credentials
const endpoint = process.env.endpoint
const spacesEndpoint = new AWS.Endpoint(endpoint);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey
});
module.exports = s3;