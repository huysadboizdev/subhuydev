import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import depositModel from '../models/depositModel.js'

//import cloudinary from 'cloudinary'
//api to register
export const registerUser = async (req, res) => {
    try {
        const { username, email, phone, password_1, password_2, dob } = req.body


        if (!username || !email || !phone || !password_1 || !password_2 || !dob) {
            return res.json({ success: false, message: 'Hãy Điền Đầy Đủ Thông Tin' })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Hãy Điền Email Hợp Lệ" })
        }

        const isUser = await userModel.findOne({ email })

        if (isUser) {
            return res.json({ success: false, message: 'Email này đã tồn tại' })
        }
        const isUsername = await userModel.findOne({ username})
        if (isUsername) {
            return res.json({ success: false, message: 'Tên đăng nhập đã tồn tại' })
        }

        const isPhone = await userModel.findOne({ phone })
        if (isPhone) {
            return res.json({ success: false, message: 'Số điện thoại này đã tồn tại' })
        }

        if (phone.length !== 10) {
            return res.json({ success: false, message: 'Hãy Điền Số Điện Thoại Hợp Lệ ' })
        }

        if (password_1.length < 8) {
            return res.json({ success: false, message: 'Mật Khẩu Không Đủ Mạnh' })
        }

        if (password_1 !== password_2) {
            return res.json({ success: false, message: 'Mật Khẩu Không Giống Nhau' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password_1, salt)

        const userData = {
            username,
            email,
            phone,
            password: hashedPassword,
            dob,  
        }

        const newUser = new userModel(userData)
        await newUser.save()

        res.json({ success: true })

    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error.message })
    }
}

// api login

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.json({ success: fasle, message: 'missing email or password' })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: 'email not found' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({ success: false, message: 'wrong password' })
        }
        

        const accesstoken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET)

        return res.json({ success: true, message: 'login success', accesstoken })
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: 'Some thing wrong' })
    }
}


// api profile
export const profile = async (req, res) => {
    try {
        const { userId } = req.body

        console.log(userId)
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error.message })
    }
}

// update profile
export const updateProfile = async (req, res) => {
    try{
        const {userId, username, phone, dob} = req.body
        const image = req.file
        console.log(userId)
        const user = await userModel.findById(userId)

        if(!user) {
            return res.json({success: false, message: 'user not found'})
        }

        if(username) {
            await userModel.findByIdAndUpdate(userId, {username})
        }

        if(phone) {
            await userModel.findByIdAndUpdate(userId, {phone})
        }
        
        if(dob) {
            await userModel.findByIdAndUpdate(userId, {dob})
        }

        if (image) {
            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(image.path, { resource_type: 'image' })
            const imageUrl = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageUrl })
        }
        res.json({ success: true, messgae: 'profile updated' })
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error.message })
    }
}

// update password
export const updatePassword = async (req, res) => {
    try {
        const { userId, newPassword1, newPassword2, oldPassword } = req.body

        if (!newPassword1 || !newPassword2 || !oldPassword) {
            return res.json({ success: false, message: "Missing required fields." })
        }

        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." })
        }

        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return res.status(400).json({ success: false, message: "Incorrect old password." })
        }

        if (newPassword1 !== newPassword2) {
            return res.status(400).json({ success: false, message: "New passwords do not match." })
        }

        const hashedPassword = await bcrypt.hash(newPassword1, 10);

        await userModel.findByIdAndUpdate(userId, { password: hashedPassword })

        res.json({ success: true, message: "Password updated successfully." })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "An error occurred. Please try again." })
    }
}

export const getServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const orderService = async (req, res) => {
    try {
        const { userId, serviceId } = req.body;

        if (!userId || !serviceId) {
            return res.status(400).json({ success: false, message: "Missing userId or serviceId." });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found." });
        }

        const newOrder = new Order({ user: userId, service: serviceId });
        await newOrder.save();

        res.json({ success: true, message: "Service ordered successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred. Please try again." });
    }
};

// Yêu cầu nạp tiền
export const depositRequest = async (req, res) => {
    try {
        const { userId, amount } = req.body;

        if (!userId || !amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Số tiền không hợp lệ." });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Người dùng không tồn tại." });
        }

        // Tạo yêu cầu nạp tiền, lưu vào DB
        const newDeposit = new depositModel({
            userId,
            amount,
            status: "pending", // Chờ admin xác nhận
        });

        await newDeposit.save();
        res.json({ success: true, message: "Yêu cầu nạp tiền đã được gửi." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lỗi hệ thống." });
    }
};




