import { Request, Response } from "express";
import { AppDataSource } from "../Config/Data-source";
import { Product } from "../Entities/Product";

const productRepository = AppDataSource.getRepository(Product);

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, imageUrl } = req.body;

    if (!name || !price || !stock) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const newProduct = productRepository.create({
      name,
      description,
      price,
      stock,
      imageUrl,
    });

    await productRepository.save(newProduct);

    return res.status(201).json({
      message: "Producto creado exitosamente",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    return res.status(500).json({ message: "Error al crear el producto" });
  }
};

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await productRepository.find();
    return res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return res.status(500).json({ message: "Error al obtener los productos" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productRepository.findOneBy({ id: Number(id) });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json(product);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return res.status(500).json({ message: "Error al obtener el producto" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, imageUrl } = req.body;

    const product = await productRepository.findOneBy({ id: Number(id) });
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;
    product.imageUrl = imageUrl ?? product.imageUrl;

    await productRepository.save(product);

    return res.json({
      message: "Producto actualizado correctamente",
      product,
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return res.status(500).json({ message: "Error al actualizar el producto" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await productRepository.findOneBy({ id: Number(id) });
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    await productRepository.remove(product);

    return res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return res.status(500).json({ message: "Error al eliminar el producto" });
  }
};

