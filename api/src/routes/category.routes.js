import express from 'express';
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import { createCategory, deleteCategory, updateCategory, viewCategories, viewCategory } from '../controller/category.controller.js';
import { SuggestProduct } from '../controller/product.controller.js';

const router = express.Router();

router.post('/create', verifyAdmin, createCategory);
router.get('/view/:id', viewCategory);
router.put('/update/:id', verifyAdmin, updateCategory);
router.delete('/delete/:id', verifyAdmin, deleteCategory);
router.get('/view', viewCategories);
router.get('/suggested',SuggestProduct)
export default router;
