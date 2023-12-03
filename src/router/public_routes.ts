import { Router } from "express";
import * as publicController from "../controller/public_controller";

const router: Router = Router();

router.get("/checkUserNameExist", publicController.checkUserNameExist);
router.get("/verify-provider", publicController.verifyEmailProvider);

export default router;
