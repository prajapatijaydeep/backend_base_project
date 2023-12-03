import express from "express";
import dotenv from "dotenv";

import http from "http";

dotenv.config({ path: ".env" });

import { HttpStatusCodes } from "./constants/http_status_code";
import * as database from "./db/connection";

import customResponse = require("./middleware/custom_responses");
import decodeIdToken = require("./middleware/verify_token");
import verifyApiKey = require("./middleware/verify_api_key");

import publicRoutes from "./router/public_routes";

import userRoutes from "./router/user_routes";
import activityRoutes from "./router/activity_routes";
import webhookRoutes from "./router/webhook_routes";
import cors = require("cors");

import firebaseInit from "./firebase/firebase_init";
import * as util from "util";
import { makeSocketConnection } from "./services/socket_service";
import { saveErrorLogs } from "./services/error_log_service";
import morgan from "morgan";

const setupForStripeWebhooks = {
  // Because Stripe needs the raw body, we compute it but only when hitting the Stripe callback URL.
  verify: function (req, res, buf) {
    const url = req.originalUrl;
    if (url.startsWith("/webhook")) {
      req.rawBody = buf.toString();
    }
  },
};

const PORT = process.env.PORT || 80;

const app = express();
const server = http.createServer(app);
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);
app.use(morgan("dev"));
app.use(customResponse);

//check incoming request is valid json or not
app.use(express.urlencoded({ extended: true }));
app.use(express.json(setupForStripeWebhooks));
// app.use(express.raw());

app.use("/webhook", express.raw({ type: "application/json" }), webhookRoutes);

app.use(verifyApiKey);

// if response of api contain undefined it will replace it to null
app.set("json replacer", function (key: any, value: any) {
  // undefined values are set to `null`
  if (typeof value === "undefined") {
    return null;
  }
  return value;
});

firebaseInit();
app.use(publicRoutes);

app.use("/user", decodeIdToken, userRoutes);
app.use("/activity", decodeIdToken, activityRoutes);

app.use("*", function (req, res) {
  res.status(404).json({
    success: false,
    error: "Page not found",
  });
});

database.connectToDb(
  () => {
    makeSocketConnection(server);
    server.listen(PORT, async () => {
      console.log("Server Started on port " + PORT);
    });
  },
  (error: any) => {
    console.log("Database connection failed : " + util.inspect(error));
  }
);

app.use(async (err: any, req: any, res: any) => {
  err.statusCode = err.statusCode || HttpStatusCodes.INTERNAL_SERVER;
  const className = err.constructor.name;

  try {
    await saveErrorLogs(err, req);
  } catch (error) {
    console.log(error);
  }

  if (className === "BaseError") {
    res.customizedOutPut(err);
  } else {
    // Error thrown by mongoose validation
    if (err.name === "ValidationError") {
      res.validationError({ err, message: err.message });
    } else if (err.code === 11000) {
      res.validationError({
        message:
          "Cannot Create Duplidate Document With " + Object.keys(err.keyValue),
      });
    } else {
      res.serverError({ message: err.message });
    }
  }
});
