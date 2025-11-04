import { Router } from "express";
import { register, login } from "../Controllers/AuthController";
import { verifyToken } from "../Middleware/AuthMiddleware";
import { verifyAdmin } from "../Middleware/AuthMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

//ruta protegida para usuarios ya autenticados
router.get("/profile", verifyToken, (req, res) => {
  const user = (req as any).user;
  res.json({ message: "Acceso permitido", user });
});

//ruta para admin
router.get("/admin-panel", verifyToken, verifyAdmin, (req, res) => {
  res.json({ message: "Bienvenido al panel de administración" });
});

export default router;
