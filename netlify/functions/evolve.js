if (
	process.env.LD_LIBRARY_PATH == null ||
	!process.env.LD_LIBRARY_PATH.includes(
		`${process.env.PWD}/node_modules/canvas/build/Release:`
	)
) {
	process.env.LD_LIBRARY_PATH = `${
		process.env.PWD
	}/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ''}`
}

var AWS = require('aws-sdk')
const fs = require('fs')
const basePath = process.cwd()

const { CL_S3_ACCESS_KEY_ID, CL_S3_SECRET_ACCESS_KEY, CL_S3_BUCKET_NAME } =
	process.env
AWS.config.update({
	accessKeyId: CL_S3_ACCESS_KEY_ID,
	secretAccessKey: CL_S3_SECRET_ACCESS_KEY,
})

exports.handler = async function (event, context) {
	var s3 = new AWS.S3()

	var BUCKET_NAME = CL_S3_BUCKET_NAME
	var OLD_KEY = event.queryStringParameters.oldName
	var NEW_KEY = event.queryStringParameters.newName
	const traits = event.queryStringParameters.traits

	try {
		// replace gif

		await s3
			.deleteObject({
				Bucket: BUCKET_NAME,
				Key: `gifs/${NEW_KEY}.gif`,
			})
			.promise()

		await s3
			.copyObject({
				Bucket: BUCKET_NAME,
				CopySource: `${BUCKET_NAME}/gifs_evolve/${OLD_KEY}.gif`,
				Key: `gifs/${NEW_KEY}.gif`,
			})
			.promise()

		// get and modify current metadata

		const data = await s3
			.getObject({
				Bucket: BUCKET_NAME,
				Key: `json/${NEW_KEY}.json`,
			})
			.promise()

		let metadata = JSON.parse(data.Body)

		metadata.name = `Cyber Adultlion #${NEW_KEY}`
		let attributes = []
		Object.entries(JSON.parse(traits)).forEach(([key, value]) =>
			attributes.push({
				trait_type: key,
				value: value,
			})
		)
		metadata.attributes = attributes

		// remove current gif

		await s3
			.deleteObject({
				Bucket: BUCKET_NAME,
				Key: `json/${NEW_KEY}.json`,
			})
			.promise()

		// replace metadata

		let params = {
			params: {
				Bucket: CL_S3_BUCKET_NAME,
				Key: `json/${NEW_KEY}.json`,
				Body: Buffer.from(JSON.stringify(metadata)),
				ContentType: 'application/json',
			},
		}

		var upload = new AWS.S3.ManagedUpload(params)

		await upload.promise()

		return {
			statusCode: 200,
			body: JSON.stringify({
				success: true,
			}),
		}
	} catch (err) {
		console.log(err)
	}
}
