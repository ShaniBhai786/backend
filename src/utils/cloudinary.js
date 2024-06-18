import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: CLOUDINARY_KEY,
        api_secret: CLOUDINARY_SECRET
    });

    const uploadOnCloudinary = async (localFilePath) => {
        try {
            if (!localFilePath) {
                return null;
            }
            else{
                const response = await cloudinary.uploader.upload(localFilePath, {resource_type: "auto"})
                console.log("File is uploaded on cloudinary successfully!!!");
                console.log(response.url)
            }
        }
        catch(error){
            console.log("Error uploading file to Cloudinary, ERROR => ", error);
            fs.unlinkSync(localFilePath)
            return null;
        }
    }

    export default uploadOnCloudinary;