
import Service from '../models/serviceModel.js'
import userModel from '../models/userModel.js'
import transactionModel from '../models/transactionModel.js'


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

// Admin duyệt nạp tiền
export const approveDeposit = async (req, res) => {
    try {
        const { transactionId } = req.body;

        const transaction = await transactionModel.findById(transactionId);
        if (!transaction || transaction.status !== "pending") {
            return res.status(400).json({ success: false, message: "Giao dịch không hợp lệ." });
        }

        const user = await userModel.findById(transaction.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Người dùng không tồn tại." });
        }

        // Cộng tiền vào tài khoản
        user.deposit += transaction.amount;
        await user.save();

        // Cập nhật trạng thái giao dịch
        transaction.status = "approved";
        await transaction.save();

        res.json({ success: true, message: "Nạp tiền thành công." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi hệ thống." });
    }
};

