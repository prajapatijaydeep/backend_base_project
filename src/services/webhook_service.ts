import dayjs from "dayjs";
import { paymentHistoryModel, userModel } from "../models";
import { addToActivity } from "../controller/activity_controller";
import { Permission, sendNotification } from "./notification_service";
import AppConstants from "../constants/app_constants";

type NonRenewingPurchaseProps = {
  userData: {
    userId: string;
    fcmToken: string[];
    pushNotifications: Permission;
  };
  transferId: string;
  period: {
    purchaseAt: number;
    expireAt: number;
  };
  planData: {
    product_id: string;
    android_product_id: string;
    plan: string;
    credit: number;
  };
  priceDetails: {
    priceInUsd: number;
    currency?: string;
    priceInCountryCurrency?: number;
  };
  session: any;
};

type RenewingPurchaseProps = {
  userData: {
    userId: string;
    fcmToken: string[];
    pushNotifications: Permission;
    userPlan: {
      id: string | null;
      name: string | null;
    } | null;
  };
  transferId: string;
  period: {
    purchaseAt: number;
    expireAt: number;
  };
  planData: {
    product_id: string;
    plan: string;
    credit: number;
  };
  priceDetails: {
    priceInUsd: number;
    currency?: string;
    priceInCountryCurrency?: number;
  };
  type: "SUBSCRIPTION_PURCHASED" | "SUBSCRIPTION_RENEW";
  session: any;
};

export const nonRenewingPurchaseHandler = async ({
  userData,
  transferId,
  period,
  planData,
  priceDetails,
  session,
}: NonRenewingPurchaseProps) => {
  const { userId } = userData;
  const { product_id, plan, credit } = planData;
  const { purchaseAt } = period;

  try {
    // save payment history
    const paymentData = await paymentHistoryModel.create(
      [
        {
          userId,
          transferId,
          credit: credit,
          priceDetails,
          status: "DONE",
          paymentType: "PLAN_PURCHASED",
          plan,
        },
      ],
      { session }
    );

    const activityData = {
      actionId: paymentData[0]?._id.toHexString(),
      userId,
      activity: {
        title: "Plan Purchased",
        message: "Enjoy This Plan",
        frontImage: null,
      },
      activityType: "USER_NOTIFICATION",
      action: {
        actionTakerId: userId,
      },
    };
    await addToActivity(activityData);

    sendNotification({
      userId,
      fcmTokenIds: userData?.fcmToken,
      title: "Project_Name",
      description: "Plan Purchased",
      permission: userData?.pushNotifications,
      imageUrl: null,
    });
  } catch (error) {
    throw error;
  }
};

export const renewingPurchaseHandler = async ({
  userData,
  transferId,
  period,
  planData,
  priceDetails,
  type,
  session,
}: RenewingPurchaseProps) => {
  const { userId } = userData;
  const { product_id, plan } = planData;
  const { purchaseAt, expireAt } = period;

  let title = "Subscription Renewed";
  let desc = "Your subscription has been renewed!";

  try {
    // save payment history
    const paymentData = await paymentHistoryModel.create(
      [
        {
          userId,
          transferId,
          priceDetails,
          status: "DONE",
          paymentType: type,
          plan,
        },
      ],
      { session }
    );

    if (type === "SUBSCRIPTION_PURCHASED") {
      title = "Subscription Purchased";
      desc =
        "Subscription successful! Get ready to explore, discover, and experience This like never before.";
    }

    await userModel.updateOne(
      { _id: userId },
      {
        $set: {
          userPlan: {
            id: product_id,
            name: plan,
            status: "ACTIVE",
            startAt: dayjs.unix(purchaseAt).toDate(),
            endAt: dayjs.unix(expireAt).toDate(),
          },
        },
      },
      { session }
    );

    const activityData = {
      actionId: paymentData[0]?._id,
      userId: userId,
      activity: {
        title,
        message: desc,
      },
      activityType: "USER_NOTIFICATION",
      action: {
        actionTakerId: userId,
      },
    };
    await addToActivity(activityData);

    sendNotification({
      userId,
      fcmTokenIds: userData?.fcmToken,
      title: "Company_Name",
      description: title,
      permission: userData?.pushNotifications,
      imageUrl: null,
    });
  } catch (error) {
    throw error;
  }
};
