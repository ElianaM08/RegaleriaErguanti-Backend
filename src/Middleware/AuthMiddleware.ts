import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(403).json({ message: "Token no proporcionado" });

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token inválido" });

    (req as any).user = decoded;
    next();
  });
};

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado: solo administradores" });
  }

  next();
};
