import express from 'express'
import {login, registerUser, requestDeposit, updateProfile, getUser, handleUserService } from '../controller/userController.js'
import multer from 'multer'
import authUser from '../middlewares/authUser.js'
import Order from '../models/orderModel.js'
//import authUser from '../middlewares/userAuth.js'
//import upload from '../middlewares/multer.js'
const userRouter = express.Router()
const upload = multer({ dest: 'uploads/' }); // Lưu tạm trước khi upload lên Cloudinary

userRouter.post('/register', registerUser)
userRouter.post('/login', login)
userRouter.post('/deposit', authUser, requestDeposit)
// userRouter.post('/update-profile', updateProfile)
// userRouter.post('/update-profile', upload.single('image'), updateProfile);
userRouter.put('/update-profile', authUser, upload.single('image'), updateProfile);
userRouter.get('/get-user', authUser, getUser)
userRouter.post('/order', authUser, handleUserService)
// userRouter.get('/services', getAllServices)
// userRouter.post('/order', authUser, createOrder)









export default userRouter