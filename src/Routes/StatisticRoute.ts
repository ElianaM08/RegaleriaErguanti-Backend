import { Router } from "express";
import { StatisticController } from "../Controllers/StatisticController";
import { verifyToken, verifyAdmin } from "../Middleware/AuthMiddleware";

const router = Router();

router.get("/me", verifyToken,verifyAdmin, StatisticController.getMyStats); 
router.get("/:userId", verifyToken, verifyAdmin,StatisticController.getByUser);
router.post("/", verifyToken, verifyAdmin, StatisticController.createForUser);
router.put("/:id", verifyToken,verifyAdmin, StatisticController.update);
router.get("/", verifyToken, verifyAdmin, StatisticController.getAll);

export default router;

