import {
  userNameExistSchema,
  verifyEmailProviderSchema,
} from "../utils/validation/validation_schema";
import { userModel } from "../models";

async function checkUserNameExist(req, res, next) {
  try {
    let isAvailable = true;
    const reqData = req.query;

    let validatedData = await userNameExistSchema.validateAsync(reqData);

    const userData = await userModel
      .findOne({ userName: validatedData.userName }, { userName: 1, _id: 0 })
      .lean();

    if (userData) {
      isAvailable = false;
    }

    res.dataFetchSuccess({
      data: { isAvailable },
    });
  } catch (error) {
    next(error);
  }
}

async function verifyEmailProvider(req, res, next) {
  try {
    const reqData = req.query;

    const validatedData = await verifyEmailProviderSchema.validateAsync(
      reqData
    );

    const inValidProviders = [
      "yopmail",
      "ckptr",
      "sharklasers",
      "grr",
      "pokemail",
      "spam4",
      "guerrillamail",
      "guerrillamailblock",
      "sparkroi",
      "gufum",
      "matra",
      "temporary-mail",
      "celebritydetailed",
    ];

    const provider = validatedData.email
      .split("@")[1]
      .toLowerCase()
      .split(".")[0];

    const isValid = !inValidProviders.includes(provider);

    res.dataFetchSuccess({
      data: { provider, isValid },
    });
  } catch (error) {
    next(error);
  }
}

export { checkUserNameExist, verifyEmailProvider };
