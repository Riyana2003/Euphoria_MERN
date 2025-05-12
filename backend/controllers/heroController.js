import HeroImage from '../models/heroModel.js';

const heroController = {
  // Get all hero images
  getAllHeroImages: async (req, res) => {
    try {
      const images = await HeroImage.find().sort({ order: 1 });
      res.json(images);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Add new hero image
  createHeroImage: async (req, res) => {
    const { title, price, buttonText, isActive, order } = req.body;
    
    if (!title || !price || !req.file) {
      return res.status(400).json({ message: 'Title, price, and image are required' });
    }

    const newImage = new HeroImage({
      title,
      price,
      buttonText: buttonText || 'SHOP NOW',
      imageUrl: '/uploads/hero-images/' + req.file.filename,
      isActive: isActive === 'true',
      order: parseInt(order) || 0
    });

    try {
      const savedImage = await newImage.save();
      res.status(201).json(savedImage);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Update hero image
  updateHeroImage: async (req, res) => {
    try {
      const image = await HeroImage.findById(req.params.id);
      if (!image) {
        return res.status(404).json({ message: 'Hero image not found' });
      }

      if (req.file) {
        image.imageUrl = '/uploads/hero-images/' + req.file.filename;
      }

      if (req.body.title) image.title = req.body.title;
      if (req.body.price) image.price = req.body.price;
      if (req.body.buttonText) image.buttonText = req.body.buttonText;
      if (req.body.isActive !== undefined) {
        image.isActive = req.body.isActive === 'true';
      }
      if (req.body.order !== undefined) {
        image.order = parseInt(req.body.order);
      }

      const updatedImage = await image.save();
      res.json(updatedImage);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Delete hero image
  deleteHeroImage: async (req, res) => {
    try {
      const image = await HeroImage.findByIdAndDelete(req.params.id);
      if (!image) {
        return res.status(404).json({ message: 'Hero image not found' });
      }
      res.json({ message: 'Hero image deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

export default heroController;