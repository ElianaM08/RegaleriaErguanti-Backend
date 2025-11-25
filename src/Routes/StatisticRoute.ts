import { Router } from "express";
import { StatisticController } from "../Controllers/StatisticController";
import { verifyToken } from "../Middleware/AuthMiddleware";
import { verifyAdmin} from "../Middleware/AuthMiddleware";
const router = Router();

router.get("/all", verifyToken, verifyAdmin,StatisticController.getAll); 
router.get("/user/:userId", verifyToken, StatisticController.getByUser);
router.post("/", StatisticController.createForUser);
router.put("/:id", StatisticController.update);


export default router;
