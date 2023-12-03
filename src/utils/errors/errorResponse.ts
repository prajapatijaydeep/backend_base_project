import { HttpStatusCodes } from "../../constants/http_status_code";
import { BaseError } from "./baseError";
import { boolean } from "joi";

const errorResponse = {
  customError({
    errorName: errorName = "Custom Error",
    statusCode = 400,
    errorDescription = "Unknown Error",
    isOperationalError = true,
    importanceType = "MEDIUM",
    errorFieldName = "unknown",
  } = {}) {
    return new BaseError({
      errorName: errorName,
      statusCode: statusCode,
      errorDescription: errorDescription,
      isOperationalError: isOperationalError,
      importanceType: importanceType,
      errorFieldName: errorFieldName,
    });
  },

  Api204Error({
    errorName: errorName = "NO_CONTENT",
    statusCode = HttpStatusCodes.NO_CONTENT,
    errorDescription = "No Content",
    isOperationalError = true,
    importanceType = "MEDIUM",
    errorFieldName = "unknown",
  } = {}) {
    return new BaseError({
      errorName: errorName,
      statusCode: statusCode,
      errorDescription: errorDescription,
      isOperationalError: isOperationalError,
      importanceType: importanceType,
      errorFieldName: errorFieldName,
    });
  },

  Api400Error({
    errorName: errorName = "BAD_REQUEST",
    statusCode = HttpStatusCodes.BAD_REQUEST,
    errorDescription = "Bad Request",
    isOperationalError = true,
    importanceType = "MEDIUM",
    errorFieldName = "unknown",
  } = {}) {
    return new BaseError({
      errorName: errorName,
      statusCode: statusCode,
      errorDescription: errorDescription,
      isOperationalError: isOperationalError,
      importanceType: importanceType,
      errorFieldName: errorFieldName,
    });
  },

  Api401Error({
    errorName: errorName = "UNAUTHORIZED",
    statusCode = HttpStatusCodes.UNAUTHORIZED,
    errorDescription = "Authentication Required",
    isOperationalError = true,
    importanceType = "MEDIUM",
    errorFieldName = "unknown",
  } = {}) {
    return new BaseError({
      errorName: errorName,
      statusCode: statusCode,
      errorDescription: errorDescription,
      isOperationalError: isOperationalError,
      importanceType: importanceType,
      errorFieldName: errorFieldName,
    });
  },

  Api403Error({
    errorName: errorName = "PLAN_LIMIT_EXCEEDED",
    statusCode = HttpStatusCodes.PLAN_LIMIT_EXCEED,
    errorDescription = "Plan Limit Exceeded",
    isOperationalError = true,
    importanceType = "MEDIUM",
    errorFieldName = "unknown",
  } = {}) {
    return new BaseError({
      errorName: errorName,
      statusCode: statusCode,
      errorDescription: errorDescription,
      isOperationalError: isOperationalError,
      importanceType: importanceType,
      errorFieldName: errorFieldName,
    });
  },

  Api404Error({
    errorName: errorName = "NOT_FOUND",
    statusCode = HttpStatusCodes.NOT_FOUND,
    errorDescription = "Requested Data is Not Found",
    isOperationalError = true,
    importanceType = "MEDIUM",
    errorFieldName = "unknown",
  } = {}) {
    return new BaseError({
      errorName: errorName,
      statusCode: statusCode,
      errorDescription: errorDescription,
      isOperationalError: isOperationalError,
      importanceType: importanceType,
      errorFieldName: errorFieldName,
    });
  },

  Api409Error({
    errorName: errorName = "DATA_EXIST",
    statusCode = HttpStatusCodes.ALREADY_EXIST,
    errorDescription = "Data already exist",
    isOperationalError = true,
    importanceType = "MEDIUM",
    errorFieldName = "unknown",
  } = {}) {
    return new BaseError({
      errorName: errorName,
      statusCode: statusCode,
      errorDescription: errorDescription,
      isOperationalError: isOperationalError,
      importanceType: importanceType,
      errorFieldName: errorFieldName,
    });
  },

  Api422Error({
    errorName: errorName = "UNPROCESSABLE_REQUEST",
    statusCode = HttpStatusCodes.UNPROCESSABLE_REQUEST,
    errorDescription = "Unprocessable Entity",
    isOperationalError = true,
    importanceType = "MEDIUM",
    errorFieldName = "unknown",
  } = {}) {
    return new BaseError({
      errorName: errorName,
      statusCode: statusCode,
      errorDescription: errorDescription,
      isOperationalError: isOperationalError,
      importanceType: importanceType,
      errorFieldName: errorFieldName,
    });
  },

  Api500Error({
    errorName: errorName = "INTERNAL_SERVER",
    statusCode = HttpStatusCodes.INTERNAL_SERVER,
    errorDescription = "Internal Server Error",
    isOperationalError = true,
    importanceType = "MEDIUM",
    errorFieldName = "unknown",
  } = {}) {
    return new BaseError({
      errorName: errorName,
      statusCode: statusCode,
      errorDescription: errorDescription,
      isOperationalError: isOperationalError,
      importanceType: importanceType,
      errorFieldName: errorFieldName,
    });
  },

  idNotFoundError({
    errorName: errorName = "NOT_FOUND",
    statusCode = HttpStatusCodes.NOT_FOUND,
    errorDescription = "Id not Found",
    isOperationalError = true,
    importanceType = "MEDIUM",
    errorFieldName = "unknown",
  } = {}) {
    return new BaseError({
      errorName: errorName,
      statusCode: statusCode,
      errorDescription: errorDescription,
      isOperationalError: isOperationalError,
      importanceType: importanceType,
      errorFieldName: errorFieldName,
    });
  },

  missingApiKey() {
    const errorName = "API_KEY_WRONG";
    const statusCode: number = HttpStatusCodes.UNPROCESSABLE_REQUEST;
    const errorDescription = "Api key is wrong or not found";
    const isOperationalError = true;
    const importanceType = "MEDIUM";
    const errorFieldName = "unknown";

    return new BaseError({
      errorName: errorName,
      statusCode: statusCode,
      errorDescription: errorDescription,
      isOperationalError: isOperationalError,
      importanceType: importanceType,
      errorFieldName: errorFieldName,
    });
  },
};

export default errorResponse;
