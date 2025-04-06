import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoute.js'
import adminRouter from './routes/adminRoute.js'
import connectCloudinary from './config/cloudinary.js';
import serviceModel from './models/serviceModel.js'
import orderModel from './models/orderModel.js'


// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cors())

// api endpoints
app.use('/api/user', userRouter)
app.use('/api/admin', adminRouter)

app.get('/', (req, res) => {
    res.send("API WORKING")
})


app.get("/user/services", async (req, res) => {
    try {
      const services = await serviceModel.find();  // Get all services
      res.json({ services });
    } catch (error) {
      res.status(500).json({ message: "Error fetching services", error });
    }
  });

  
// Create a new order
app.post("/user/order", async (req, res) => {
    try {
      const { userId, serviceId, quantity } = req.body;
      const service = await serviceModel.findById(serviceId);
      
      if (!service) {
        return res.status(400).json({ message: "Service not found" });
      }
  
      const totalPrice = service.price * quantity;
  
      const newOrder = new orderModel({
        userId,
        service: serviceId,
        quantity,
        totalPrice,
        status: "Pending"
      });
  
      await newOrder.save();
      res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
      res.status(500).json({ message: "Error creating order", error });
    }
  });




app.listen(port, () => console.log('Sever Started', port))