const basePath = process.cwd();
const MD5 = require("MD5");
const { buildSetup, startCreating } = require("../hackslips/src/main");
var fs = require('fs');
const mime = require('mime');
var AWS = require('aws-sdk');

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME } = process.env;
AWS.config.update({ accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY });

exports.handler = async function (event, context) {
  let DNA = '';
  Object.entries(event.queryStringParameters).forEach(([key, value]) => DNA += value)
  let filename = MD5(DNA);

  // check if the image already uploaded
  const headers = {
    'Access-Control-Allow-Origin': '*'
  }

  var s3 = new AWS.S3;
  try {
    await s3.headObject({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: `${filename}.gif`,
    })
    .promise();
    console.log("File already exists!");
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: `https://${AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${filename}.gif`
      }),
    };
  } catch(err) {}

  // create the image

  buildSetup();
  await startCreating(event.queryStringParameters, filename);

  // upload the image

  filename += '.gif';

  let filepath = `${basePath}/netlify/hackslips/build/gifs/${filename}`;
  const content = fs.readFileSync(filepath);

  let params = {
    params: {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: filename,
      Body: content,
      ContentType: mime.getType(filepath),
    }
  }
  
  var upload = new AWS.S3.ManagedUpload(params);

  try {
    await upload.promise();

    console.log('Successfully uploaded photo.');


    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: `https://${AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${filename}`
      }),
    };
  } catch(err) {
    console.log(err);
  }
  
};
