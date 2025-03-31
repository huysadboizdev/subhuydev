
import express from 'express';
import { addService, listService, getAllUser, deleteUser,login_admin, deleteService, editService, approveDeposit } from '../controller/adminController.js';


const adminRouter = express.Router();

adminRouter.post('/add-service', addService);
adminRouter.post('/edit-service', editService); 
adminRouter.post('/delete-service', deleteService);
adminRouter.get('/list', listService);
adminRouter.get('/all-user', getAllUser);
adminRouter.post('/delete-user', deleteUser);
adminRouter.post('/login', login_admin);
adminRouter.post('/approve', approveDeposit); // Admin duyệt nạp tiền




export default adminRouter
