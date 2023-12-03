import AppConstants from "../constants/app_constants";
import { userModel } from "../models";

const stripe = require("stripe")(AppConstants.stripeKey);

export const createStripeCustomer = async (data, userId) => {
  try {
    const customer = await stripe.customers.create(data);

    await userModel.updateOne(
      { _id: userId },
      {
        $set: {
          stripeCustomerId: customer.id,
        },
      }
    );

    return customer.id;
  } catch (error) {
    throw error;
  }
};
