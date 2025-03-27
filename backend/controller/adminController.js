
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
        const imageFile = req.file;

        if (!platform || !category || !name || !price || !speed || !imageFile) {
            return res.json({ success: false, message: "Hãy Điền Đầy Đủ Thông Tin" });
        }

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const existingService = await Service.findOne({ platform, category, name });
        if (existingService) {
            return res.status(400).json({ success: false, message: "Dịch vụ này đã có sẵn" });
        }

        const serviceData = {
            platform,
            category,
            name,
            price,
            speed,
            image: imageUrl
        };

        const newService = new Service(serviceData);
        await newService.save();

        res.json({ success: true, newService });

    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
};


// Lấy danh sách dịch vụ từ MongoDB
const listService = async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
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

export { addService, listService, deleteService };
