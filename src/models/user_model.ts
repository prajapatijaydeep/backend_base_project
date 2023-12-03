import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    _id: { type: String, required: true },
    userName: { type: String, trim: true, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: null },
    generalInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      profileImage: { type: String, default: null },
      bio: { type: String, default: null },
    },
    userType: { type: String, default: "GENERAL" }, // 'GENERAL'
    counts: {
      followingCount: { type: Number, default: 0 },
      followerCount: { type: Number, default: 0 },
    },
    fcmToken: { type: [String], default: [] },
    stripeCustomerId: { type: String, trim: true, default: null },
    stripeAccountId: { type: String, trim: true, default: null },
    pushNotifications: {
      pauseAllNotification: { type: Boolean, default: false },
    },
    role: { type: String, default: "USER" }, // USER | ADMIN
    userPlan: {
      type: Object,
      default: null,
      properties: {
        id: { type: String, required: true },
        name: {
          type: String,
          enum: ["FREE"],
          default: "FREE",
        }, //  FREE
        status: { type: String, default: "ACTIVE" }, // ACTIVE, DEACTIVE, CANCELLED, EXPIRED
        startAt: { type: Date, required: true },
        endAt: { type: Date, required: true },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("user", userSchema);
