import "reflect-metadata";
import express from "express";
import cors from "cors";
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
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/purchases", purchaseRoutes);
app.use("/products", productRoutes);

AppDataSource.initialize()
  .then(async () => {
    console.log("Conectado a la base de datos");

    app.listen(4000, () => console.log("Servidor corriendo en http://localhost:4000"));
  })
  .catch((error) => console.log(" Error al conectar la base:", error));



