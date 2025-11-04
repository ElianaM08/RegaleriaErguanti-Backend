import { Request, Response } from "express";
import { AppDataSource } from "../Config/Data-source";
import { User } from "../Entities/User";
import * as bcrypt from "bcryptjs";
import { generateToken } from "../Utils/Jwt"; 

const userRepo = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const existing = await userRepo.findOneBy({ email });
    if (existing) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const user = userRepo.create({ name, email, password, role });
    await userRepo.save(user);

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error(" Error en el registro:", error);
    res.status(500).json({ message: "Error en el registro" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }

    const user = await userRepo.findOneBy({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

   const token = generateToken({ id: user.id, role: user.role });


    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(" Error en el login:", error);
    res.status(500).json({ message: "Error en el login" });
  }
};
