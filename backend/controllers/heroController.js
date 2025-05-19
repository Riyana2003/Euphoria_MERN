import { v2 as cloudinary } from 'cloudinary';
import HeroImage from '../models/heroModel.js';

// Helper function for Cloudinary upload
async function uploadToCloudinary(file) {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'hero-banners',
    transformation: [
      { width: 1920, height: 1080, crop: "fill" },
      { quality: "auto:good" }
    ]
  });
  return result.secure_url;
}

export const getAllHeroImages = async (req, res) => {
  try {
    const images = await HeroImage.find().sort({ order: 1 });
    res.json(images);
  } catch (error) {
    console.error('Error fetching hero images:', error);
    res.status(500).json({ message: 'Failed to fetch hero images' });
  }
};

export const createHeroImage = async (req, res) => {
  try {
    const { title, price, buttonText, isActive } = req.body;
    
    if (!title || !price || !req.file) {
      return res.status(400).json({ message: 'Title, price, and image are required' });
    }

    const imageUrl = await uploadToCloudinary(req.file);

    const newImage = new HeroImage({
      title,
      price,
      buttonText: buttonText || 'SHOP NOW',
      imageUrl,
      isActive: isActive === 'true',
    });

    const savedImage = await newImage.save();
    res.status(201).json(savedImage);
  } catch (error) {
    console.error('Error creating hero image:', error);
    res.status(500).json({ message: 'Failed to create hero image' });
  }
};

export const updateHeroImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, buttonText, isActive } = req.body;

    const image = await HeroImage.findById(id);
    if (!image) {
      return res.status(404).json({ message: 'Hero image not found' });
    }

    if (req.file) {
      image.imageUrl = await uploadToCloudinary(req.file);
    }

    if (title) image.title = title;
    if (price) image.price = price;
    if (buttonText) image.buttonText = buttonText;
    if (isActive !== undefined) image.isActive = isActive === 'true';

    const updatedImage = await image.save();
    res.json(updatedImage);
  } catch (error) {
    console.error('Error updating hero image:', error);
    res.status(500).json({ message: 'Failed to update hero image' });
  }
};

export const deleteHeroImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await HeroImage.findByIdAndDelete(id);
    
    if (!image) {
      return res.status(404).json({ message: 'Hero image not found' });
    }

    // Extract public ID from Cloudinary URL
    const urlParts = image.imageUrl.split('/');
    const publicId = urlParts[urlParts.length - 1].split('.')[0];
    await cloudinary.uploader.destroy(`hero-banners/${publicId}`);

    res.json({ message: 'Hero image deleted successfully' });
  } catch (error) {
    console.error('Error deleting hero image:', error);
    res.status(500).json({ message: 'Failed to delete hero image' });
  }
};