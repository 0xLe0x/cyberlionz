const basePath = process.cwd()
const { buildSetup, startCreating } = require('../hackslips/src/main')
var fs = require('fs')
const mime = require('mime')
var AWS = require('aws-sdk')

const { AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME } =
	process.env
AWS.config.update({
	accessKeyId: AWS_S3_ACCESS_KEY_ID,
	secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
})

exports.handler = async function (event, context) {
	let DNA = ''
	Object.entries(event.queryStringParameters).forEach(
		([key, value]) => (DNA += value)
	)

	// create the image

	buildSetup()
	await startCreating(event.queryStringParameters, DNA)

	// upload the image

	let gif_filename = DNA + '.gif'

	let gif_filepath = `${basePath}/netlify/hackslips/build/gifs/${gif_filename}`
	const gif_content = fs.readFileSync(gif_filepath)

	let gif_params = {
		params: {
			Bucket: AWS_S3_BUCKET_NAME,
			Key: `gifs_evolve/${gif_filename}`,
			Body: gif_content,
			ContentType: mime.getType(gif_filepath),
		},
	}

	var gif_upload = new AWS.S3.ManagedUpload(gif_params)

	try {
		await gif_upload.promise()

		console.log('Successfully uploaded.')
	} catch (err) {
		console.log(err)
	}
}
