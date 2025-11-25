import { Request, Response } from "express";
import { AppDataSource } from "../Config/Data-source";
import { Statistic } from "../Entities/Statistic";
import { User } from "../Entities/User";

export class StatisticController {

  static async getByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const statisticRepo = AppDataSource.getRepository(Statistic);

      const stats = await statisticRepo.findOne({
        where: { user: { id: Number(userId) } },
        relations: ["user", "purchases", "purchases.product"],
      });

      if (!stats) {
        return res.status(404).json({ message: "No se encontraron estadísticas" });
      }

      return res.json(stats);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al obtener estadísticas" });
    }
  }
  static async createForUser(req: Request, res: Response) {
    try {
      const { userId } = req.body;

      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({ where: { id: userId } });

      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

      const statsRepo = AppDataSource.getRepository(Statistic);

      const existing = await statsRepo.findOne({
        where: { user: { id: userId } },
      });

      if (existing) return res.json(existing);

      const newStats = statsRepo.create({
        user,
        totalInvested: 0,
        totalSold: 0,
        totalProfit: 0,
        totalTransactions: 0,
      });

      await statsRepo.save(newStats);

      return res.json(newStats);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al crear estadísticas" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body;

      const statsRepo = AppDataSource.getRepository(Statistic);
      const stats = await statsRepo.findOne({ where: { id: Number(id) } });

      if (!stats) {
        return res.status(404).json({ message: "Estadística no encontrada" });
      }

      Object.assign(stats, body);
      await statsRepo.save(stats);

      return res.json(stats);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al actualizar estadísticas" });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Acceso denegado. Solo admin." });
      }

      const statsRepo = AppDataSource.getRepository(Statistic);

      const allStats = await statsRepo.find({
        relations: ["user", "purchases", "purchases.product"],
      });

      return res.json(allStats);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al obtener estadísticas" });
    }
  }
}
