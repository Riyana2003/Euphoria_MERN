import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  category: { type: String, required: true },
  question: { type: String, required: true, unique: true },
  answer: { type: String, required: true },
});

const FAQ = mongoose.model('FAQ', faqSchema);
export default FAQ;