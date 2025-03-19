import mongoose from 'mongoose';
import chatbotModel from '../models/chatbotModel.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();




// Sample FAQs
const sampleFAQs = [
  {
    category: 'Product Information',
    question: 'What are the ingredients in your foundation?',
    answer: 'Our foundation is made with natural ingredients like aloe vera, vitamin E, and hyaluronic acid. It’s free from parabens and sulfates.',
  },
  {
    category: 'Order and Shipping',
    question: 'How long does shipping take?',
    answer: 'Shipping typically takes 3-5 business days within the US and 7-10 business days internationally.',
  },
  {
    category: 'Returns and Refunds',
    question: 'What is your return policy?',
    answer: 'We accept returns within 30 days of purchase. The product must be unused and in its original packaging. Please contact our support team to initiate a return.',
  },
];

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    // Insert sample FAQs
    return chatbotModel.insertMany(sampleFAQs);
  })
  .then(() => {
    console.log('Sample FAQs added to the database');
    mongoose.connection.close(); // Close the connection
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB or inserting FAQs:', err);
  });