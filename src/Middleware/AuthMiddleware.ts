import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  console.log("AUTH HEADER RECIBIDO:", req.headers["authorization"]);

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(403).json({ message: "Token no proporcionado" });

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token inválido" });

    const payload = decoded as { id: number; role: string };

    req.user = {
      id: payload.id,
      role: payload.role,
    };

    next();
  });
};

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado: solo administradores" });
  }

  next();
};
