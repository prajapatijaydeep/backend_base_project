import admin = require("firebase-admin");
import AppConstants from "../constants/app_constants";

export default function firebaseInit() {
  const serviceJson = JSON.parse(
    Buffer.from(AppConstants.serviceAccount, "base64").toString("utf-8")
  );

  const serviceAccount = serviceJson as admin.ServiceAccount;

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: AppConstants.firebaseStorageBucket,
  });
}
