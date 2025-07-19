import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import path from "path";
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOncloudinary = async (localfilepath) => {
  // define fullPath before try so it's accessible in both try and catch
  const fullPath = path.resolve(localfilepath);

  try {
    if (!localfilepath) return null;

    const response = await cloudinary.uploader.upload(fullPath, {
      resource_type: "auto",
    });

    console.log("file is upload", response.url);

    //  delete only if file exists
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log("Local file deleted:", fullPath);
    }
 // returing the response which contain the url with many data object
    return response;
  } catch (error) {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log("Local file deleted after failure:", fullPath);
    }

    console.error("Cloudinary upload error:", error);
    return null;
  }
};

export { uploadOncloudinary };
