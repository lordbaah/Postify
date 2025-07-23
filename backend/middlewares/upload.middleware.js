import multer from 'multer';
// No need for 'path' or 'fs' when using memoryStorage for Cloudinary uploads

// Configure storage for Multer to use memoryStorage.
// This means the file will be stored in memory as a Buffer,
// which is then passed directly to Cloudinary for upload.
const storage = multer.memoryStorage();

// Filter to allow only specific image file types
const fileFilter = (req, file, cb) => {
  // Check the mimetype of the uploaded file.
  // Only allow JPEG, JPG, PNG, and GIF images.
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/gif'
  ) {
    cb(null, true); // Accept the file (pass `true` to the callback)
  } else {
    // Reject the file if it's not an allowed image type.
    // Pass an Error object to the callback to indicate rejection.
    cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed!'), false);
  }
};

// Initialize Multer upload middleware with the configured storage and file filter
const upload = multer({
  storage: storage, // Use memoryStorage for Cloudinary uploads
  fileFilter: fileFilter, // Apply the file type filter
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB (5 * 1024 * 1024 bytes)
  },
});

export default upload;
