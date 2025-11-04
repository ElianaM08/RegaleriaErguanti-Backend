import { Request, Response } from "express";
import { AppDataSource } from "../Config/Data-source";
import { Purchase } from "../Entities/Purchase";
import { User } from "../Entities/User";
import { Product } from "../Entities/Product";
import { Statistic } from "../Entities/Statistic";

const purchaseRepository = AppDataSource.getRepository(Purchase);
const userRepository = AppDataSource.getRepository(User);
const productRepository = AppDataSource.getRepository(Product);
const statisticRepository = AppDataSource.getRepository(Statistic);

export const createPurchase = async (req: Request, res: Response) => {
  try {
    const { userId, productId, statisticId, quantity, totalPrice } = req.body;

    if (!userId || !productId || !quantity || !totalPrice) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const user = await userRepository.findOneBy({ id: userId });
    const product = await productRepository.findOneBy({ id: productId });
    const statistic = statisticId
      ? await statisticRepository.findOneBy({ id: statisticId })
      : null;

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    const newPurchase = purchaseRepository.create({
      user,
      product,
      statistic: statistic || null,
      quantity,
      totalPrice,
      actionType: "purchase",
    });

    const savedPurchase = await purchaseRepository.save(newPurchase);
    res.status(201).json(savedPurchase);
  } catch (error) {
    console.error("Error al crear la compra:", error);
    res.status(500).json({ message: "Error al crear la compra" });
  }
};

export const getPurchases = async (_req: Request, res: Response) => {
  try {
    const purchases = await purchaseRepository.find({
      relations: ["user", "product", "statistic"],
      order: { purchaseDate: "DESC" },
    });
    res.json(purchases);
  } catch (error) {
    console.error("Error al obtener compras:", error);
    res.status(500).json({ message: "Error al obtener las compras" });
  }
};

export const getPurchaseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const purchase = await purchaseRepository.findOne({
      where: { id: Number(id) },
      relations: ["user", "product", "statistic"],
    });

    if (!purchase) return res.status(404).json({ message: "Compra no encontrada" });
    res.json(purchase);
  } catch (error) {
    console.error("Error al obtener la compra:", error);
    res.status(500).json({ message: "Error al obtener la compra" });
  }
};

export const updatePurchase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity, totalPrice, statisticId } = req.body;

    const purchase = await purchaseRepository.findOneBy({ id: Number(id) });
    if (!purchase) return res.status(404).json({ message: "Compra no encontrada" });

    if (quantity !== undefined) purchase.quantity = quantity;
    if (totalPrice !== undefined) purchase.totalPrice = totalPrice;

    if (statisticId) {
      const statistic = await statisticRepository.findOneBy({ id: statisticId });
      if (!statistic)
        return res.status(404).json({ message: "Estadística no encontrada" });
      purchase.statistic = statistic;
    }

    const updatedPurchase = await purchaseRepository.save(purchase);
    res.json(updatedPurchase);
  } catch (error) {
    console.error("Error al actualizar la compra:", error);
    res.status(500).json({ message: "Error al actualizar la compra" });
  }
};

export const deletePurchase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const purchase = await purchaseRepository.findOneBy({ id: Number(id) });

    if (!purchase) return res.status(404).json({ message: "Compra no encontrada" });

    await purchaseRepository.remove(purchase);
    res.json({ message: "Compra eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la compra:", error);
    res.status(500).json({ message: "Error al eliminar la compra" });
  }
};