
import express from 'express';
import { addService, listService, removeService, getAllUser, deleteUser, login } from '../controller/adminController.js';


const adminRouter = express.Router();

adminRouter.post('/add', addService);
adminRouter.post('/remove', removeService);
adminRouter.get('/list', listService);
adminRouter.get('/all-user', getAllUser);
adminRouter.post('/delete-user', deleteUser);
adminRouter.post('/login', login);

export default adminRouter
