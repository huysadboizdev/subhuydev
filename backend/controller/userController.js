import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import transactionModel from '../models/transactionModel.js';
import {v2 as cloudinary} from 'cloudinary';



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
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: 'Missing email or password' });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'Email not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Wrong password' });
        }

        const accesstoken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });

        return res.json({
            success: true,
            message: 'Login successful',
            accesstoken,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                dob: user.dob,
                balance: user.balance,
                image: user.image ? `data:${user.image.contentType};base64,${user.image.data.toString('base64')}` : null
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: 'Something went wrong' });
    }
};

// Cập nhật profile (lưu ảnh lên Cloudinary)
    // export const updateProfile = async (req, res) => {
    //     try {
    //         const { userId, username, phone, dob } = req.body;
    //         const image = req.file;
    
    //         const user = await userModel.findById(userId);
    //         if (!user) {
    //             return res.json({ success: false, message: 'User not found' });
    //         }
    
    //         let updateData = {};
    //         if (username) updateData.username = username;
    //         if (phone) updateData.phone = phone;
    //         if (dob) updateData.dob = dob;
    
    //         if (image) {
    //             // Upload ảnh lên Cloudinary
    //             const uploadedImage = await cloudinary.uploader.upload(image.path, { folder: 'user_profiles' });
    //             updateData.image = uploadedImage.secure_url; // Chỉ lưu URL
    //         }
    
    //         const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true });
    //         res.json({ success: true, message: 'Profile updated', user: updatedUser });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ success: false, message: 'An error occurred' });
    //     }
    // };


    export const updateProfile = async (req, res) => {
        try {
            const { userId, username, phone, dob } = req.body;
            const image = req.file;
    
            console.log(userId);
            const user = await userModel.findById(userId);
    
            if (!user) {
                return res.json({ success: false, message: "User not found" });
            }
    
            if (username) {
                await userModel.findByIdAndUpdate(userId, { username });
            }
    
            if (phone) {
                await userModel.findByIdAndUpdate(userId, { phone });
            }
    
            if (dob) {
                await userModel.findByIdAndUpdate(userId, { dob });
            }
    
            if (image) {
                // Upload image to Cloudinary
                const imageUpload = await cloudinary.uploader.upload(image.path, { resource_type: "image" });
                const imageUrl = imageUpload.secure_url;
    
                await userModel.findByIdAndUpdate(userId, { image: imageUrl });
            }
    
            res.json({ success: true, message: "Profile updated" });
        } catch (error) {
            console.log(error);
            res.status(400).json({ success: false, message: error.message });
        }
    };
    
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
export const requestDeposit = async (req, res) => {
    try {
        const { userId, amount } = req.body;

        if (!userId || !amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Số tiền không hợp lệ' });
        }

        const newTransaction = new transactionModel({ userId, amount });
        await newTransaction.save();

        res.json({ success: true, message: 'Yêu cầu nạp tiền đã được gửi' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};
