import express from 'express'
import {login, registerUser, requestDeposit, updateProfile, getUser } from '../controller/userController.js'
import multer from 'multer'
import authUser from '../middlewares/authUser.js'
import Service from '../models/serviceModel.js'
import Order from '../models/orderModel.js'
//import authUser from '../middlewares/userAuth.js'
//import upload from '../middlewares/multer.js'
const userRouter = express.Router()
const upload = multer({ dest: 'uploads/' }); // Lưu tạm trước khi upload lên Cloudinary

userRouter.post('/register', registerUser)
userRouter.post('/login', login)
userRouter.post('/deposit', requestDeposit)
// userRouter.post('/update-profile', updateProfile)
// userRouter.post('/update-profile', upload.single('image'), updateProfile);
userRouter.put('/update-profile', authUser, upload.single('image'), updateProfile);
userRouter.get('/get-user', authUser, getUser)

userRouter.get('/services', async (req, res) => {
    try {
        const services = await Service.find({});
        res.json({ success: true, services });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
})




export default userRouter