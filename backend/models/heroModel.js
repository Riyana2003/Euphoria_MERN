import mongoose from 'mongoose';
const HeroImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const HeroImage = mongoose.model('HeroImage', HeroImageSchema);
  
  export default HeroImage;