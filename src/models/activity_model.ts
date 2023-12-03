import mongoose from "mongoose";
const { Schema } = mongoose;

const activitySchema = new Schema(
  {
    actionId: {
      type: Schema.Types.ObjectId,
      ref: "comments",
      default: null,
    },
    userId: {
      type: String,
      required: true,
    },
    activity: {
      title: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        default: null,
      },
      otherInfo: {
        type: String,
        trim: true,
        default: null,
      },

      frontImage: {
        type: String,
        trim: true,
        default: null,
      },
      backImage: {
        type: String,
        trim: true,
        default: null,
      },
    },
    action: {
      actionTakerId: {
        type: String,
        required: true,
      },
      postId: { type: Schema.Types.ObjectId, ref: "post", default: null },
    },
    generationDetails: {
      type: Object,
      default: null,
      properties: {
        id: { type: Schema.Types.ObjectId, ref: "generated_images", default: null },
        creatorId: {
          type: String,
          default: null,
        },
        postId: { type: Schema.Types.ObjectId, ref: "post", default: null },
      },
    },
    activityType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("activities", activitySchema);
