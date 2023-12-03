import * as admin from "firebase-admin";
import userModel from "../models/user_model";

export interface Permission {
  pauseAllNotification?: boolean;
}
interface SendNotificationParameter {
  userId: string;
  fcmTokenIds: string[];
  title: string;
  description: string;
  permission: Permission;
  imageUrl?: string;
}
async function sendNotification({
  userId,
  fcmTokenIds,
  title,
  description,
  permission,
  imageUrl,
}: SendNotificationParameter): Promise<any> {
  // return if user pause all notifications
  if (permission?.pauseAllNotification) {
    return;
  }

  // if fcmToken array empty
  if (fcmTokenIds?.length === 0) {
    return;
  }

  const payload = {
    title: title.charAt(0).toUpperCase() + title.slice(1).toLowerCase(),
    imageUrl: imageUrl ?? undefined,
    body: description,
  };

  const multiCastPayLoad = {
    tokens: fcmTokenIds,
    notification: payload,
    android: {
      priority: "high" as const,
    },
    data: {
      click_action: "FLUTTER_CLICK_ACTION",
    },
    content_available: true,
    mutable_content: true,
    apns: {
      headers: {
        "apns-priority": "10",
      },
      payload: {
        aps: {
          sound: "default",
          badge: 1,
        },
      },
    },
  };

  try {
    let isUpdateNedded = false;
    const sendNoti = await admin.messaging().sendMulticast(multiCastPayLoad);

    const res = sendNoti.responses;

    // make token null if success is false
    for (const [index, data] of res.entries()) {
      if (!data.success) {
        isUpdateNedded = true;
        await userModel.updateOne(
          { _id: userId },
          { $unset: { ["fcmToken." + index]: null } }
        );
      }
    }

    if (isUpdateNedded) {
      await userModel.updateOne({ _id: userId }, { $pull: { fcmToken: null } });
    }
  } catch (e) {
    console.log(e);
  }
}
export { sendNotification };
