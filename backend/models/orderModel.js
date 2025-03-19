import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    items: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        shade: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: { type: Number, required: true },
        image: { type: Array, required: true },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Khalti'],
      required: true,
    },
    payment: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    pidx: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Order = mongoose.model('Order', orderSchema);
  
  export default Order;