import * as util from "util";
import AppConstants from "../constants/app_constants";
import { saveErrorLogs } from "../services/error_log_service";
import {
  userModel,
} from "../models";
import { mongoDbClient } from "../db/connection";
import {
  nonRenewingPurchaseHandler,
  renewingPurchaseHandler,
} from "../services/webhook_service";
import { dataReturnOnlyIfUserExist } from "../services/user_service";

const stripe = require("stripe")(AppConstants.stripeKey);

//stripe redirect to local host command
//stripe listen --forward-to localhost:5001/webhook/
//stripe trigger payment_intent.succeeded

async function stripeEventForCheckout(req, res, next) {
  try {
    const rawPayload = req.rawBody;
    const sig = req.headers["stripe-signature"];
    const stripeWebhookSecret = AppConstants.stripeWebhookSecret;
    let event;

    event = stripe.webhooks.constructEvent(
      rawPayload,
      sig,
      stripeWebhookSecret
    );

    let eventObject = event.data.object;

    console.log("stripe event completed : " + util.inspect(eventObject));

    const session = await mongoDbClient.startSession();
    try {
      await session.startTransaction();

      // Handle the event
      switch (event.type) {
        case "checkout.session.completed":
          try {
            if (eventObject.mode === "payment") {
              const { userId, credit, plan, product_id } =
                eventObject?.metadata;
              const transferId = eventObject.payment_intent;
              const purchaseAt = eventObject.created;

              const userData = await userModel
                .findOne({ _id: userId }, { fcmToken: 1, pushNotifications: 1 })
                .lean();

              const amount = eventObject.amount_total / 100;

              await nonRenewingPurchaseHandler({
                userData: {
                  userId: userData._id,
                  fcmToken: userData.fcmToken,
                  pushNotifications: userData.pushNotifications,
                },
                transferId,
                period: { purchaseAt, expireAt: 0 },
                planData: {
                  credit,
                  plan,
                  product_id,
                  android_product_id: product_id,
                },
                priceDetails: {
                  priceInUsd: amount,
                },
                session,
              });
            }
            break;
          } catch (error) {
            throw error;
          }

        case "subscription_schedule.updated":
          break;

        case "invoice.payment_succeeded":
          try {
            const invoiceObject = eventObject.lines.data[0];

            const amount = eventObject?.amount_paid;

            const { userId, credit, plan, product_id } =
              eventObject?.subscription_details?.metadata;

            const transferId = invoiceObject?.id;
            const startDate = invoiceObject?.period?.start;
            const endDate = invoiceObject?.period?.end;

            const billingReason = eventObject?.billing_reason;

            const user = await dataReturnOnlyIfUserExist({ userId });

            await renewingPurchaseHandler({
              userData: {
                userId: user._id,
                fcmToken: user.fcmToken,
                pushNotifications: user.pushNotifications,
                userPlan: {
                  id: user.userPlan?.id ?? null,
                  name: user.userPlan?.name ?? null,
                },
              },
              transferId,
              period: {
                purchaseAt: startDate,
                expireAt: endDate,
              },
              planData: {
                credit,
                plan,
                product_id,
              },
              priceDetails: {
                priceInUsd: amount,
              },
              type:
                billingReason === "subscription_create"
                  ? "SUBSCRIPTION_PURCHASED"
                  : "SUBSCRIPTION_RENEW",
              session,
            });
            break;
          } catch (error) {
            throw error;
          }

        case "invoice.payment_failed":
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    await saveErrorLogs(error, req);
    console.error("stripe event error : " + error.toString());
    res.status(500).json({ error: error.toString() });
  }
}

async function stripeEventForWithdraw(req, res, next) {
  try {
    const rawPayload = req.rawBody;
    const sig = req.headers["stripe-signature"];
    const stripeWebhookSecret = AppConstants.stripeWebhookSecret;

    let event;

    event = stripe.webhooks.constructEvent(
      rawPayload,
      sig,
      stripeWebhookSecret
    );

    if (event.type === "payout.paid") {
      console.log(event);
    }
    res.status(200).json({ success: true });
  } catch (error) {
    await saveErrorLogs(error, req);
    console.error("stripe event error : " + error.toString());
    res.status(500).json({ error: error.toString() });
  }
}

export { stripeEventForCheckout, stripeEventForWithdraw };
