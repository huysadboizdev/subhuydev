import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved"], default: "pending" },
}, { timestamps: true });

const transactionModel = mongoose.model("transaction", transactionSchema);
export default transactionModel;
