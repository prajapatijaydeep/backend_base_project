import mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentHistorySchema = new Schema(
  {
    userId: { type: String, required: true },
    transferId: { type: String, required: true },
    credit: { type: Number, default: null },
    priceDetails: {
      priceInUsd: { type: Number, required: true },
      currency: { type: String, default: "USD" },
      priceInCountryCurrency: { type: Number, default: null },
    },
    status: { type: String, default: "PENDING" }, // PENDING | DONE
    paymentType: { type: String, required: true }, // SUBSCRIPTION_PURCHASED | SUBSCRIPTION_RENEW
    plan: { type: String, default: null }, // Name of plan
  },
  { timestamps: true }
);

export default mongoose.model("payment_history", paymentHistorySchema);
