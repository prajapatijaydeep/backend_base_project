import { userModel } from "../models";
import errorResponse from "../utils/errors/errorResponse";

type Props = {
  userId: string;
  returnData?: Record<string, any>;
  errorMessage?: string;
  errorFieldName?: string;
};

export const checkUserExist = async (userId: string) => {
  try {
    const userData = await userModel.exists({ _id: userId });
    if (userData) {
      return userData;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const dataReturnOnlyIfUserExist = async ({
  userId,
  returnData,
  errorMessage,
  errorFieldName,
}: Props) => {
  try {
    const user = await userModel
      .findOne({ _id: userId }, returnData && returnData)
      .lean();
    if (!user) {
      throw errorResponse.Api404Error({
        errorDescription: errorMessage ?? "User not found",
        errorFieldName: errorFieldName ?? "user_id",
      });
    }
    return user;
  } catch (error) {
    throw error;
  }
};
