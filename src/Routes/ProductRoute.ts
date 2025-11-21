import { Router } from "express";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../Controllers/ProductController";
import upload from "../Middleware/Upload";

const router = Router();

router.post("/", upload.single("image"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;