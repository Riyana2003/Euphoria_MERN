import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import upload from '../middleware/multer.js';
import heroController from '../controllers/heroController.js';

const router = express.Router();

// Public routes
router.get('/', heroController.getAllHeroImages);

// Admin protected routes
router.post('/', adminAuth, upload.single('image'), heroController.createHeroImage);
router.put('/:id', adminAuth, upload.single('image'), heroController.updateHeroImage);
router.delete('/:id', adminAuth, heroController.deleteHeroImage);

export default router;