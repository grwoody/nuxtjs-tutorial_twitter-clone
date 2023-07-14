import formidable from "formidable"
import { createTweet } from "../../../db/tweets.js"
import { tweetTransformer } from "~/server/transformers/tweet.js"
import { createMediaFile } from "../../../db/mediaFiles.js"
import { uploadToCloudinary } from "../../../utils/cloudinary.js"

export default defineEventHandler(async (event) => {
  // instead of JSON, we'll use a multipart form data
  // sending an emit is not possible with JSON

  const form = formidable({})

  // don't want to return until this is finished, we want to wrap in a promise

  const response = await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if(err) {
        reject(err)
      }
      resolve({ fields, files })
    })
  })

  // save information, create tweet
  const { fields, files } = response
  
  // who is creating a tweet
  const userId = event.context?.auth?.user?.id // include `?` in case of undefined [see @3:05:27]

  // console.log(`text: ${JSON.stringify(fields.text)}`)

  const tweetData = {
    text: JSON.stringify(fields.text),  // without stringify, arg is invalid. fields.text is processed as List<String> when a String is expected. no idea why
    // text: fields.text,
    authorId: userId
  }

  const tweet = await createTweet(tweetData)

  // files returns an object so we must iterate over each entry
  const filePromises = Object.keys(files).map(async key => {
    const file = files[key]
    const filePath = file[0].filepath

    // console.log(file[0].filepath)

    const cloudinaryResource = await uploadToCloudinary(filePath)

    // console.log(cloudinaryResource)

    return createMediaFile({
      url: cloudinaryResource.secure_url,
      providerPublicId: cloudinaryResource.public_id,
      userId: userId,
      tweetId: tweet.id

    })
  })

  await Promise.all(filePromises)


  
    



  return {
    tweet: tweetTransformer(tweet)
  }
})