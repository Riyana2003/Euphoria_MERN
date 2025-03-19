import {v2 as cloudinary} from "cloudinary"

const connectCloudinary = async () =>{

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "deegt8pcx",
        api_key: process.env.CLOUDINARY_API_KEY|| "496778453569845",
        api_secret: process.env.CLOUDINARY_API_SECRET|| "lWu7h53qx2kVCywDZKQxjmT2nFE",
    })
}
export default connectCloudinary;