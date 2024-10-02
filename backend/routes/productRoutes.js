import express from "express";
const router = express.Router();
import products from "../data/products.js";
import { createProduct, createProductReview, deleteProduct, getProducts, getProductsById, getTopProducts, updateProduct } from "../controllers/productsController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get("/top",getTopProducts);
router.route('/:id').get(getProductsById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);
router.route('/:id/reviews').post(protect, createProductReview);

export default router; 
