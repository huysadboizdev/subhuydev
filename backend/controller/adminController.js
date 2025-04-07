
import Service from '../models/serviceModel.js'
import userModel from '../models/userModel.js'
import transactionModel from '../models/transactionModel.js';
import orderModel from '../models/orderModel.js'



export const login_admin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            return res.json({ success: true })
        }

        res.json({ success: false });
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error.message })
    }
}



//function manager user
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.body

        await userModel.findByIdAndDelete(userId)
        res.json({ success: true, message: "Xóa người dùng thành công" })

    }
    catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error.message })
    }
}

export const getAllUser = async (req, res) => {
    try {
        const users = await userModel.find()

        res.json({ success: true, users })
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error.message })
    }
}



export const login_user = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Người dùng không tồn tại" });
        }

        if (user.isBlocked) {
            return res.json({ success: false, message: "Tài khoản của bạn đã bị chặn" });
        }

        // Thực hiện xác thực mật khẩu (nếu có logic mật khẩu)
        res.json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// function manager service
const addService = async (req, res) => {
    try {
        const { platform, category, name, price, speed } = req.body;

        if (!platform || !category || !name || !price || !speed) {
            return res.json({ success: false, message: "Hãy Điền Đầy Đủ Thông Tin" });
        }

        const newService = new Service({ platform, category, name, price, speed });
        await newService.save();

        res.json({ success: true, newService });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const editService = async (req, res) => {
    try {
        const { serviceId, platform, category, name, price, speed } = req.body;

        if (!serviceId || !platform || !category || !name || !price || !speed) {
            return res.json({ success: false, message: "Hãy điền đầy đủ thông tin" });
        }

        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            { platform, category, name, price, speed },
            { new: true }
        );

        if (!updatedService) {
            return res.status(404).json({ success: false, message: "Dịch vụ không tồn tại" });
        }

        res.json({ success: true, updatedService });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Lấy danh sách dịch vụ từ MongoDB
const listService = async (req, res) => {
    try {
        const services = await Service.find();
        res.json({ success: true, services }); // Trả về có success để frontend xử lý dễ hơn
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


// Xóa dịch vụ trong MongoDB
const deleteService = async (req, res) => {
    try {
        const {serviceId} = req.body;
        await Service.findByIdAndDelete(serviceId);
        res.json({ success: true, message: "Xóa dịch vụ thành công" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }  
}

export { addService, listService, deleteService, editService };


// Admin chấp nhận yêu cầu nạp tiền


export const approveDeposit = async (req, res) => {
    try {
        const { transactionId } = req.body;

        const transaction = await transactionModel.findById(transactionId);
        if (!transaction || transaction.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Giao dịch không hợp lệ' });
        }

        // Cập nhật trạng thái giao dịch
        transaction.status = 'approved';
        await transaction.save();

        // Cộng tiền vào tài khoản user
        await userModel.findByIdAndUpdate(
            transaction.userId,
            { $inc: { balance: transaction.amount } }
        );

        res.json({ success: true, message: 'Nạp tiền thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};


// Admin từ chối yêu cầu nạp tiền
export const rejectDeposit = async (req, res) => {
    try {
        const { transactionId } = req.body;

        const transaction = await transactionModel.findById(transactionId);
        if (!transaction || transaction.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Giao dịch không hợp lệ' });
        }

        transaction.status = 'rejected';
        await transaction.save();

        res.json({ success: true, message: 'Giao dịch đã bị từ chối' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};


// Lấy danh sách yêu cầu nạp tiền (status: pending)
export const getTransactions = async (req, res) => {
    try {
        const transactions = await transactionModel.find({ status: 'pending' }).populate({
            path: 'userId',
            model: 'user',
            select: 'username email'
        });

        res.json({
            success: true,
            message: 'Danh sách yêu cầu nạp tiền',
            transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

export const handleAdminOrders = async (req, res) => {
    const { action, orderId, status } = req.body;
  
    try {
      // Lấy tất cả đơn hàng
      if (action === "getAllOrders") {
        const orders = await orderModel
          .find()
          .populate("service")
          .sort({ orderDate: -1 });
  
        return res.status(200).json({ success: true, orders });
      }
  
      // Thay đổi trạng thái đơn hàng
      if (action === "updateOrderStatus") {
        const order = await orderModel.findById(orderId);
        if (!order) {
          return res.status(400).json({ success: false, message: "Đơn hàng không tồn tại" });
        }
  
        order.status = status;
        await order.save();
  
        return res.status(200).json({ success: true, message: "Trạng thái đơn hàng đã được cập nhật", order });
      }
  
      // Xóa đơn hàng
      if (action === "deleteOrder") {
        const order = await orderModel.findById(orderId);
        if (!order) {
          return res.status(400).json({ success: false, message: "Đơn hàng không tồn tại" });
        }
  
        await order.deleteOne();
        return res.status(200).json({ success: true, message: "Đơn hàng đã được xóa" });
      }
  
      // Nếu action không hợp lệ
      return res.status(400).json({ success: false, message: "Hành động không hợp lệ" });
  
    } catch (error) {
      console.error("Lỗi:", error);
      return res.status(500).json({ success: false, message: "Lỗi xử lý", error });
    }
  };
  




