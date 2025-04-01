import express from 'express'
import {login, registerUser, requestDeposit } from '../controller/userController.js'

//import authUser from '../middlewares/userAuth.js'
//import upload from '../middlewares/multer.js'
const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', login)
userRouter.post('/deposit', requestDeposit)




export default userRouter