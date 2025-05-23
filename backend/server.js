  import express from 'express';
  import cors from 'cors';
  import 'dotenv/config';
  import connectDB from './config/mongodb.js';
  import userRouter from './routes/userRoute.js';
  import connectCloudinary from './config/cloudinary.js';
  import productRouter from './routes/productRoute.js';
  import cartRouter from './routes/cartRoute.js';
  import orderRouter from './routes/orderRoute.js';
  import profileRouter from './routes/profileRoute.js';
import heroRouter from './routes/heroRoute.js';

  // App Config
  const app = express();
  const port = process.env.PORT || 4000;


  // Connect to MongoDB and Cloudinary
  connectDB();
  connectCloudinary();

  // Middlewares
  app.use(express.json());
  app.use(cors());
  

  // API Endpoints
  app.use('/api/user', userRouter);
  app.use('/api/product', productRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/order', orderRouter);
  app.use('/api/profile', profileRouter);
  app.use('/api/hero', heroRouter )

  // Default Route
  app.get('/', (req, res) => {
    res.send('Api is Working');
  });

  // Start Server
  app.listen(port, () => console.log('Server started on PORT: ' + port));