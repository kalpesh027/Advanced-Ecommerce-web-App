import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "2d" },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
