import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: String, required: true },
}, { minimize: false, timestamps: true })

const userModel = mongoose.model('user', userSchema)

export default userModel