import "reflect-metadata";
import { DataSource } from "typeorm";
import { User} from "../Entities/User";
import { Product } from "../Entities/Product";
import {Purchase} from "../Entities/Purchase";
import {Statistic} from "../Entities/Statistic";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mssql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User, Product, Purchase, Statistic],
    options:{
        encrypt: false,
    },
})