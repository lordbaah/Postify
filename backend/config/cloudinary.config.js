import { v2 as cloudinary } from 'cloudinary';
import ENV from './env.js';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary.
 * This function uses cloudinary.uploader.upload_stream for efficient buffer uploads.
 * @param {Buffer} fileBuffer - The buffer of the file to upload.
 * @param {string} folder - The folder name in Cloudinary to store the image (e.g., 'blog_posts', 'profile_images').
 * @param {Object} [options={}] - Optional Cloudinary upload options (e.g., transformation, public_id_prefix).
 * @returns {Promise<Object>} A promise that resolves to the Cloudinary upload result (e.g., { secure_url, public_id }).
 */
export const cloudinaryUpload = async (fileBuffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    // Define default transformation options based on folder
    let defaultTransformation = [];
    if (folder === 'blog_posts') {
      defaultTransformation = [
        {
          width: 1200,
          height: 800,
          crop: 'limit',
          quality: 'auto:good',
          fetch_format: 'auto',
        },
      ];
    } else if (folder === 'user_profiles') {
      defaultTransformation = [
        {
          width: 400,
          height: 400,
          crop: 'fill',
          gravity: 'face',
          quality: 'auto:good',
          fetch_format: 'auto',
        },
      ];
    }

    // Combine default transformations with any provided options
    const uploadOptions = {
      folder: folder,
      resource_type: 'auto', // Automatically detect file type
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'], // Explicitly allow formats
      transformation: defaultTransformation,
      ...options, // Merge any additional options provided by the caller
    };

    // Create an upload stream to Cloudinary.
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
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
export const extractPublicId = (cloudinaryUrl) => {
  if (!cloudinaryUrl || typeof cloudinaryUrl !== 'string') {
    return null;
  }

  try {
    // Regex to capture the public ID from a Cloudinary URL.
    // It looks for '/v<timestamp>/' followed by the public ID, then an optional '.' and file extension.
    // The public ID part is captured in group 1.
    const matches = cloudinaryUrl.match(/\/v\d+\/(.+?)(?:\.\w+)?$/);
    return matches ? matches[1] : null;
  } catch (error) {
    console.error('Error extracting public_id from URL:', error);
    return null;
  }
};

/**
 * Deletes an image from Cloudinary using its public ID.
 * @param {string} publicId - The public ID of the image to delete.
 * @returns {Promise<Object>} A promise that resolves to the Cloudinary deletion result.
 */
export const deleteCloudinaryImage = async (publicId) => {
  try {
    if (publicId) {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log('Image deleted from Cloudinary:', result);
      return result;
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};
