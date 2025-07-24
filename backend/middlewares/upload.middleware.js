import multer from 'multer'; // Import Multer directly

// File filter function to validate image types
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    // Reject the file with an error message
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
  }
};

// Multer configuration for post images
// Using memoryStorage to store the file buffer in memory before sending to Cloudinary.
export const uploadPostImage = multer({
  storage: multer.memoryStorage(), // Store file in memory as a buffer
  fileFilter: imageFileFilter, // Apply the image type filter
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for post images
  },
});

// Multer configuration for profile images
// Using memoryStorage to store the file buffer in memory before sending to Cloudinary.
export const uploadProfileImage = multer({
  storage: multer.memoryStorage(), // Store file in memory as a buffer
  fileFilter: imageFileFilter, // Apply the image type filter
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for profile images
  },
});
