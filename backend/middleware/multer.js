import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Dynamic field configuration that matches your frontend
export const productUpload = upload.fields([
  // Main product images
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
  
  // Shade images (supports up to 10 shades with 4 images each)
  ...Array.from({ length: 24 }, (_, i) => [
    { name: `shade${i}_image1`, maxCount: 1 },
    { name: `shade${i}_image2`, maxCount: 1 },
    { name: `shade${i}_image3`, maxCount: 1 },
    { name: `shade${i}_image4`, maxCount: 1 }
  ]).flat()
]);

export default upload;