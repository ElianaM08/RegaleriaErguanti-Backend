import { Request, Response } from "express";
import { AppDataSource } from "../Config/Data-source";
import { User } from "../Entities/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../Utils/Jwt";

const userRepo = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const existing = await userRepo.findOneBy({ email });
    if (existing) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const userCount = await userRepo.count();
    const role = userCount === 0 ? "admin" : "user";

    const newUser = userRepo.create({
      name,
      email,
      password,
    });

    await userRepo.save(newUser);

    res.status(201).json({
      message: `Usuario registrado correctamente como ${role}`,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role },
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el registro" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }

    const user = await userRepo.findOne({
        where: { email, active: true }
      });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    let validPassword = await bcrypt.compare(password, user.password);
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
    res.status(500).json({ message: "Error en el login" });
  }
};
