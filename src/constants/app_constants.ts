export default class AppConstants {
  static firebaseStorageBucket: string = process.env.FIRE_STOREGE_BUCKET;
  static mongoDbUrl: string = process.env.MONGO_DB_URL;
  static apiKey: string = process.env.API_KEY;
  static serviceAccount = process.env.SERVICE_ACC_FILE;
  static stripeKey = process.env.STRIPE_API_KEY;
  static stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
}
