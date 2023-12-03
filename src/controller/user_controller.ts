import errorResponse from "../utils/errors/errorResponse";
import {
  userIdRequireSchema,
  addUserSchema,
  updateUserSchema,
  addNotificationTokenSchema,
} from "../utils/validation/validation_schema";
import { removeExtraFields } from "../utils/app_util";
import { objectToDotNotation } from "../utils/app_util";
import { userModel } from "../models";
import { checkUserExist, dataReturnOnlyIfUserExist } from "../services/user_service";
import { checkUserNameExist } from "./public_controller";

async function createUser(req, res, next) {
  try {
    const reqData = req.body;
    const validatedData = await addUserSchema.validateAsync(reqData);

    const { userId } = validatedData;

    // check if user already exist
    const result = await checkUserExist(userId);

    if (result) {
      throw errorResponse.Api409Error({
        errorDescription: "User already exist with this userId",
        errorFieldName: "user_id",
      });
    }

    validatedData["_id"] = userId;

    try {
      let newData = await userModel.create(validatedData);

      const finalData = await removeExtraFields(
        "user",
        JSON.parse(JSON.stringify(newData))
      );

      res.dataUpdateSuccess({
        data: finalData,
      });
    } catch (error) {
      if (error.code === 11000) {
        throw errorResponse.Api409Error({
          errorDescription: "Username Already Taken",
          errorFieldName: "userName",
        });
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
}

async function getUser(req, res, next) {
  try {
    const reqData = req.query;
    const validatedData = await userIdRequireSchema.validateAsync(reqData);

    // fetch user details
    const user = await dataReturnOnlyIfUserExist({
      userId: validatedData.userId,
      returnData: {
        updatedAt: 0,
        createdAt: 0,
        fcmToken: 0,
        stripeCustomerId: 0,
        stripeAccountId: 0,
        role: 0,
      },
    });

    const finalData = await removeExtraFields("user", user);

    res.dataFetchSuccess({
      data: finalData,
    });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const reqData = req.body;
    let validatedData = await updateUserSchema.validateAsync(reqData);

    const { userId, userName } = validatedData;
    delete validatedData.userId;

    // check if user exist
    const user = await dataReturnOnlyIfUserExist({
      userId,
    });

    if (userName) {
      // check if userName is already exist
      const isDuplicateUsername = await userModel
        .exists({
          $and: [{ _id: { $ne: userId } }, { userName }],
        })
        .lean();
      if (isDuplicateUsername) {
        throw errorResponse.Api409Error({
          errorDescription: "UserName Already Taken",
          errorFieldName: "userName",
        });
      }
    }

    // convert object to dot notation
    const updateUser = await objectToDotNotation(validatedData);

    // update user data
    const newUserData = await userModel
      .findOneAndUpdate(
        { _id: userId },
        {
          $set: updateUser,
        },
        { new: true }
      )
      .lean();

    const finalData = await removeExtraFields("user", newUserData);

    res.dataUpdateSuccess({
      data: finalData,
    });
  } catch (error) {
    next(error);
  }
}

async function addNotificationToken(req, res, next) {
  try {
    const reqData = req.body;
    let validatedData = await addNotificationTokenSchema.validateAsync(reqData);

    const { userId, fcmToken } = validatedData;

    // update fcmToken to userData if user exist
    const updateData = await userModel
      .updateOne({ _id: userId }, { $addToSet: { fcmToken } })
      .lean();
    if (updateData.matchedCount === 0) {
      throw errorResponse.Api404Error({
        errorDescription: "User Not Found",
        errorFieldName: "user_id",
      });
    }

    res.dataUpdateSuccess();
  } catch (error) {
    next(error);
  }
}

export { createUser, getUser, updateUser, addNotificationToken };
