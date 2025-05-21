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

// Enhanced CORS configuration
const allowedOrigins = [
  'https://euphoria-mern.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4000',
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Increased payload limit
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect to services
connectDB();
connectCloudinary();



// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/profile', profileRouter);
app.use('/api/hero', heroRouter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Default Route
app.get('/', (req, res) => {
  res.send('Euphoria API is Working');
});

// Error handler for CORS
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({
      error: 'CORS',
      message: 'Cross-origin requests not allowed',
      allowedOrigins
    });
  } else {
    next(err);
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server started on PORT: ${port}`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
});

// Export for Vercel
export default app;