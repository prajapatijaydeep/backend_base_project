import { Router } from "express";
import * as webhookController from "../controller/webhook_controller";

const router: Router = Router();

/*
command to run stripe locally
1. stripe login
2. stripe listen --forward-to localhost:5001/webhook/
 */

router.post("/checkout-completed", webhookController.stripeEventForCheckout);
router.post("/withdraw-completed", webhookController.stripeEventForWithdraw);

export default router;
