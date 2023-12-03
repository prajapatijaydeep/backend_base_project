import { errorLogsModel } from "../models";

async function saveErrorLogs(error, req) {
  try {
    if (error.importanceType !== "LOW") {
      await errorLogsModel.create({
        statusCode: error?.statusCode ?? 500,
        className: error?.constructor?.name ?? "unknownError",
        errorMessage: error?.message ?? "",
        text: error.toString(),
        originalUrl: req?.originalUrl,
        query: req?.query,
        body: req?.body,
      });
    }

    return;
  } catch (error) {
    console.log("error while saving error:- ", error);
  }
}

export { saveErrorLogs };
