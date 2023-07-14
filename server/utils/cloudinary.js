// import { v2 as cloudinary } from "cloudinary"
import { v2 as _cloudinary } from "cloudinary"

const cloudinary = () => {
  const config = useRuntimeConfig()

  _cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret
  })

  return _cloudinary
}

export const uploadToCloudinary = (image) => {
  return new Promise((resolve, reject) => {
    // get access to env variables
    // const config = useRuntimeConfig()

    // create a cloudinary method to avoid reptition
    // cloudinary.config({
    //   cloud_name: config.cloudinaryCloudName,
    //   api_key: config.cloudinaryApiKey,
    //   api_secret: config.cloudinaryApiSecret
    // })

    // cloudinary.uploader.upload(image, (error, data) => {    // data reports if image upload is successful
    cloudinary().uploader.upload(image, (error, data) => {
      if (error) {
        reject(error)
      }
      resolve(data)
    })
  })
}