const mongoose = require("mongoose");

const errorSchema = new mongoose.Schema(
  {
    statusCode: {
      type: Number,
      required: true,
    },
    className: {
      type: String,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    text: {
      type: String,
      default: null,
    },
    originalUrl: {
      type: String,
      default: null,
    },
    query: {
      type: Object,
      default: null,
    },
    body: {
      type: Object,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("error_logs", errorSchema);
