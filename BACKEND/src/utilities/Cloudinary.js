import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// upload files on cloduniary by url
const uploadOnCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath) return null;
    // upload file

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file has been upload sucessfully on cloudinary
    //console.log("File has been Successfully uploaded on Cloud", response.url);
    fs.unlinkSync(localFilePath)
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath)
    // remove the locally saved file as the upload operation got failed
    console.log("File upload is failed",error);
    return null;
  }
};


// Delete file from Cloudinary by URL
const deleteFromCloudinary = async function (fileUrl) {
  try {
    if (!fileUrl) return null;

    // Extract the publicId from the URL
    const publicId = getPublicIdFromUrl(fileUrl);

    // Delete the file from Cloudinary
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "auto", // Adjust this if you're dealing with other types of resources
    });

    console.log("File deleted successfully from Cloudinary:", response);
    return response;
  } catch (error) {
    console.log("File deletion failed:", error);
    return null;
  }
};

// Helper function to extract publicId from Cloudinary URL
const getPublicIdFromUrl = function (fileUrl) {
  // Example URL: https://res.cloudinary.com/{cloud_name}/image/upload/v1234567890/sample.jpg
  const parts = fileUrl.split('/');
  const fileNameWithExtension = parts.pop(); // Gets 'sample.jpg'
  const versionPart = parts.pop(); // Gets 'v1234567890'
  const publicId = `${versionPart}/${fileNameWithExtension.split('.')[0]}`; // Gets 'v1234567890/sample'
  return publicId;
};
export {uploadOnCloudinary, deleteFromCloudinary}
