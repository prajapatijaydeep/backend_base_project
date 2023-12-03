import AppConstants from "../constants/app_constants";
import errorResponse from "../utils/errors/errorResponse";

export = (req, res, next) => {
  const apiKey = req.headers.api_key;
  const trueApiKey = AppConstants.apiKey;

  if (apiKey === trueApiKey) {
    next();
  } else {
    next(errorResponse.missingApiKey());
  }
};
