import * as admin from "firebase-admin";
import errorResponse from "../utils/errors/errorResponse";
import AppConstants from "../constants/app_constants";
import * as databaseHelper from "../utils/database_helper/database_helper";

export = async (req, res, next) => {
  const auth = req.headers?.authorization;
  try {
    if (auth) {
      if (auth !== "Bearer null" && auth?.startsWith("Bearer ")) {
        try {
          const idToken = auth.split("Bearer ")[1];
          const decodedToken = await admin.auth().verifyIdToken(idToken);
          req.authorization = decodedToken;
        } catch (error) {
          next(
            errorResponse.Api400Error({
              errorDescription: "Token is not given or it is not valid",
              importanceType: "HIGH",
            })
          );
        }
      } else {
        next(
          errorResponse.Api401Error({
            errorDescription: "Bearer Token Not Found",
            importanceType: "HIGH",
          })
        );
      }
    }

    const userId = req?.headers?.user_id;

    if (!userId) {
      next(
        errorResponse.idNotFoundError({
          errorDescription: "user_id is required in header",
          importanceType: "HIGH",
        })
      );
    } else {
      req.body.userId = userId;
      req.query.userId = userId;

      next();
    }
  } catch (error) {
    next(error);
  }
};
