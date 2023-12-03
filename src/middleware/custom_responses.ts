import { HttpStatusCodes } from "../constants/http_status_code";

const customResponses = {
  customizedOutPut(err, isSuccess = false) {
    return this.status(err.statusCode).json({
      success: isSuccess,
      error: err.message,
      importanceType: err.importanceType,
      errorFieldName: err.errorFieldName,
    });
  },

  dataUpdateSuccess({
    message = "Data Updated Successfully",
    data = null,
  } = {}) {
    const statusCode: number = HttpStatusCodes.OK;

    return this.status(statusCode).json({
      success: true,
      message: message,
      data: data,
    });
  },

  dataDeleteSuccess({
    message = "Data Deleted Successfully",
    data = null,
  } = {}) {
    const statusCode: number = HttpStatusCodes.OK;

    return this.status(statusCode).json({
      success: true,
      message: message,
      data: data,
    });
  },

  dataFetchSuccess({
    data = null,
    message = "Data Fetched Successfully",
  } = {}) {
    const statusCode: number = HttpStatusCodes.OK;

    return this.status(statusCode).json({
      success: true,
      message: message,
      data: data,
    });
  },

  serverError({ message = "Internal Server Error" } = {}) {
    const statusCode: number = HttpStatusCodes.INTERNAL_SERVER;

    return this.status(statusCode).json({
      success: false,
      error: message,
      importanceType: "HIGH",
    });
  },

  validationError({ err = null, message = "Validation Error" } = {}) {
    const statusCode: number = HttpStatusCodes.BAD_REQUEST;

    return this.status(statusCode).json({
      success: false,
      error: message,
      errorFieldName: err.details[0].path[0] ?? "unknown",
      importanceType: "MEDIUM",
    });
  },
};

export = (req, res, next) => {
  Object.assign(res, customResponses);
  next();
};
