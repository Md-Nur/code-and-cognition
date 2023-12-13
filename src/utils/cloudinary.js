import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePaht) => {
  try {
    if (!localFilePaht) return null;
    // Upload file to cloudinary
    const response = await cloudinary.uploader.upload(localFilePaht, {
      resource_type: "auto",
    });
    // file uploaded successfully
    console.log("file uploaded successfully.", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePaht); // removed the locally saved temp file as it is already uploaded to cloudinary

  }
};

export default uploadOnCloudinary;
