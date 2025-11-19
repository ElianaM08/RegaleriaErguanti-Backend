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
        relations: ["user", "purchases"],
      });

      if (!stats) {
        return res.status(404).json({ message: "No se encontraron estadísticas" });
      }

      return res.json(stats);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  static async createForUser(req: Request, res: Response) {
    try {
      const { userId } = req.body;

      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({ where: { id: userId } });

      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

      const statsRepo = AppDataSource.getRepository(Statistic);
      const newStats = statsRepo.create({ user });

      await statsRepo.save(newStats);

      return res.json(newStats);
    } catch (error) {
      return res.status(500).json({ error });
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
      return res.status(500).json({ error });
    }
  }
}
