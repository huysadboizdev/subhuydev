
import Service from '../models/serviceModel.js'
import userModel from '../models/userModel.js'


// api login 
export const login = async (req, res) => {
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

// function manager service
const addService = async (req, res) => {
    try {
        const { platform, category, name, price, speed } = req.body;

        if (!platform || !category || !name || !price || !speed) {
            return res.status(400).json({ error: "Thiếu dữ liệu đầu vào" });
        }
        
        const existingService = await Service.findOne({ platform, category, name });
        if (existingService) {
            return res.status(400).json({ error: "Dịch vụ này đã có sẵn" });
        }

        const newService = new Service({ platform, category, name, price, speed });
        await newService.save();

        res.json({ message: "Dịch vụ đã được thêm thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy danh sách dịch vụ từ MongoDB
const listService = async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Xóa dịch vụ trong MongoDB
const removeService = async (req, res) => {
    try {
        const { platform, category, name } = req.body;

        if (!platform || !category || !name) {
            return res.status(400).json({ error: "Thiếu dữ liệu đầu vào" });
        }

        const deletedService = await Service.findOneAndDelete({ platform, category, name });

        if (deletedService) {
            res.json({ message: "Dịch vụ được xóa" });
        } else {
            res.status(400).json({ error: "Không tìm thấy dịch vụ" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addService, listService, removeService };
