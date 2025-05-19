import express from 'express';
import { 
  getAllHeroImages, 
  createHeroImage, 
  updateHeroImage, 
  deleteHeroImage 
} from '../controllers/heroController.js';
import adminAuth from '../middleware/adminAuth.js';
import upload from '../middleware/multer.js';

const heroRouter = express.Router();

// Public route
heroRouter.get('/', getAllHeroImages);

// Admin protected routes
heroRouter.post('/', upload.single('image'), createHeroImage);
heroRouter.put('/:id',  upload.single('image'), updateHeroImage);
heroRouter.delete('/:id',  deleteHeroImage);

export default heroRouter;