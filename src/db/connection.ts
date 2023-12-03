// const mongoose = require('mongoose');
import mongoose = require("mongoose");
import AppConstants from "../constants/app_constants";

let mongoDbClient;

const connectToDb = async (success, failure) => {
  const dbUri = AppConstants.mongoDbUrl;
  mongoose.set("strictQuery", false);

  try {
    mongoDbClient = await mongoose.connect(dbUri);
    success();
  } catch (e) {
    failure(e);
  }
};

export { connectToDb, mongoDbClient };
