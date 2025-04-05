import express from 'express'
import {login, registerUser, requestDeposit, updateProfile, getUser } from '../controller/userController.js'
import multer from 'multer'
import authUser from '../middlewares/authUser.js'

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




export default userRouter