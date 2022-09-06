import express  from "express";
import {
    getProducts,
    getProductById,
    saveProducts,
    updateProduct,
    deleteProduct
} from '../controllers/ProductController.js';
const router = express.Router();

router.get('/product',getProducts);
router.get('/product/:id',getProductById);
router.post('/product',saveProducts);
router.patch('/product/:id',updateProduct);
router.delete('/product/:id',deleteProduct);

export default router;