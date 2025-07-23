import ENV from './env';

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary.
 * @param {Buffer} fileBuffer - The buffer of the file to upload.
 * @param {string} folder - The folder name in Cloudinary to store the image (e.g., 'blog_posts', 'profile_images').
 * @returns {Promise<Object>} A promise that resolves to the Cloudinary upload result (e.g., { secure_url, public_id }).
 */
export const cloudinaryUpload = async (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    // Create an upload stream to Cloudinary.
    // The 'folder' option organizes uploads in your Cloudinary account.
    // 'resource_type: "auto"' allows Cloudinary to automatically detect the file type.
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder, resource_type: 'auto' },
      (error, result) => {
        if (result) {
          resolve(result); // Resolve with the Cloudinary result on success
        } else {
          reject(error); // Reject with the error on failure
        }
      }
    );
    // End the stream with the file buffer, triggering the upload.
    uploadStream.end(fileBuffer);
  });
};

/**
 * Extracts the public ID from a Cloudinary secure URL.
 * The public ID is typically the part after the last slash and before the file extension,
 * including any folder structure.
 * Example URL: https://res.cloudinary.com/your_cloud_name/image/upload/v123456789/folder/subfolder/image_name.jpg
 * Public ID: folder/subfolder/image_name
 * @param {string} imageUrl - The secure URL of the image on Cloudinary.
 * @returns {string|null} The public ID of the image, or null if it cannot be extracted.
 */
export const getCloudinaryPublicId = (imageUrl) => {
  if (!imageUrl) return null;

  // Regular expression to extract the public ID from a Cloudinary URL.
  // It looks for a pattern like '/v<timestamp>/<public_id_path>.<extension>'
  // and captures the public_id_path.
  const regex = /\/v\d+\/(.+?)(?:\.\w+)?$/;
  const match = imageUrl.match(regex);

  if (match && match[1]) {
    // The captured group match[1] should be the public ID.
    // For example, if the URL is '.../v12345/my_folder/my_image.jpg', match[1] will be 'my_folder/my_image'.
    return match[1];
  }
  return null;
};

/**
 * Deletes an image from Cloudinary using its public ID.
 * @param {string} publicId - The public ID of the image to delete.
 * @returns {Promise<Object>} A promise that resolves to the Cloudinary deletion result.
 */
export const cloudinaryDelete = async (publicId) => {
  return new Promise((resolve, reject) => {
    if (!publicId) {
      return reject(
        new Error('Public ID is required for Cloudinary deletion.')
      );
    }
    // Destroy method deletes the asset from Cloudinary.
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (result) {
        resolve(result); // Resolve with the deletion result
      } else {
        reject(error); // Reject with the error
      }
    });
  });
};
