import mongoose from "mongoose";

const mongooseIdHelper = {
  isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  },
  getRandomMongoId() {
    return new mongoose.Types.ObjectId();
  },
  getMongooseIdFromString(id) {
    return new mongoose.Types.ObjectId(id);
  },
};

export default mongooseIdHelper;
