import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    platform: String,
    category: String,
    name: String,
    price: Number,
    speed: String,
});

const serviceModel = mongoose.model("server", serviceSchema);
export default serviceModel;
