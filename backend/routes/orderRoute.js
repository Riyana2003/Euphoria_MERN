import express from 'express'
import { placeOrder, initiateKhaltiPayment, verifyKhaltiPayment, allOrders, userOrders, updateStatus} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'
import attachProducts from '../middleware/attachproducts.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.get('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// Payment Features
orderRouter.post('/place', authUser, attachProducts, placeOrder)
orderRouter.post('/khalti/initiate',authUser, attachProducts,initiateKhaltiPayment)
orderRouter.post('/khalti/verify', authUser, verifyKhaltiPayment)

// User Feature
orderRouter.post('/userorders', authUser,attachProducts, userOrders)

export default orderRouter