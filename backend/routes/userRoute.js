import express from 'express'
import {   login, registerUser} from '../controller/userController.js'
//import authUser from '../middlewares/userAuth.js'
//import upload from '../middlewares/multer.js'
const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', login)
//userRouter.post('/admin', adminLogin)
//userRouter.get('/get-user', authUser, getUser)
// userRouter.get('/all-user', allUser)
//userRouter.put('/update-profile', upload.single('image'), authUser, updateProfile)
// userRouter.post('/delete-user', deleteUser)

export default userRouter