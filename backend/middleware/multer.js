import multer from 'multer';
import path from 'path';

// Set up the storage engine with a unique file name and file filter
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // You can specify a directory here
    callback(null, 'uploads/');
  },
  filename: function (req, file, callback) {
    // Generate a unique file name by adding a timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    callback(null, uniqueSuffix + path.extname(file.originalname)); // Adding extension to the file name
  },
});

// File validation: Accept only images
const fileFilter = (req, file, callback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true); // Accept the file
  } else {
    callback(new Error('Only image files are allowed'), false); // Reject the file
  }
};

// Set up multer with limits and file validation
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB (adjust as needed)
  },
});

export default upload;
