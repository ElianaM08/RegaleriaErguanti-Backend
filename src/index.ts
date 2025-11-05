import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./Config/Data-source";
import authRoutes from "./Routes/AuthRoute";
import dotenv from "dotenv";
import { User } from "./Entities/User";
import  bcrypt from "bcryptjs";
import purchaseRoutes from "./Routes/PurchaseRoute";
import productRoutes from "./Routes/ProductRoute";;

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/products", productRoutes);

AppDataSource.initialize()
  .then(async () => {
    console.log("Conectado a la base de datos");

    const userRepo = AppDataSource.getRepository(User);
    const existingAdmin = await userRepo.findOneBy({ email: "tamierguanti@gmail.com" });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const adminUser = userRepo.create({
        name: "Tamara",
        email: "tamierguanti@gmail.com",
        password: hashedPassword,
        role: "admin",
      });
      await userRepo.save(adminUser);
      console.log("Administrador creado (tamierguanti@gmail.com / admin123)");
    }

    app.listen(4000, () => console.log(" Servidor corriendo en http://localhost:4000"));
  })
  .catch((error) => console.log(" Error al conectar la base:", error));
