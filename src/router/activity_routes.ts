import { Router } from "express";
import * as activityController from "../controller/activity_controller";

const router: Router = Router();

router.get("/", activityController.getActivity);

export default router;