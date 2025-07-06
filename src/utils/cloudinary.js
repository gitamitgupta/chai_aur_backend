import { v2 as cloudinary } from 'cloudinary'; 
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();
 cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:process.env.CLOUDINARY_API , 
        api_secret:process.env.CLOUDINARY_API_SECRET
    });

   const uploadOncloudinary = async (localfilepath)=>{
    try {
        if(!localfilepath) return null;
      const response= await cloudinary.uploader.upload(localfilepath,{
            resource_type:"auto"
        })
        // upload on cloudinary
        console.log("file is upload",response.url);
     return response;
    } catch (error) {
        // remove the locallay saved file if the upload is fail
        fs.unlinkSync(localfilepath);
        console.log(error.message);
        

        return null;
        
    }
    
   }

   export {uploadOncloudinary}
      