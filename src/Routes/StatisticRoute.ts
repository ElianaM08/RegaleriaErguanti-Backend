import { Router } from "express";
import { StatisticController } from "../Controllers/StatisticController";

const router = Router();

router.get("/user/:userId", StatisticController.getByUser);
router.post("/", StatisticController.createForUser);
router.put("/:id", StatisticController.update);

export default router;
