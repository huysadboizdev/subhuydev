import express from 'express'
import {    login, registerUser, depositRequest} from '../controller/userController.js'
//import authUser from '../middlewares/userAuth.js'
//import upload from '../middlewares/multer.js'
const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', login)

userRouter.post('/deposit', depositRequest); // Yêu cầu nạp tiền


export default userRouter