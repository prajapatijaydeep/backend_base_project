import { Router } from "express";
import * as userController from "../controller/user_controller";

const router: Router = Router();

router.post("/", userController.createUser);
router.get("/", userController.getUser);
router.patch("/", userController.updateUser);

router.patch("/add_fcm_token", userController.addNotificationToken);

export default router;
