import express from 'express';
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import upload from '../cloud/multerConfig.js'; // Correctly import multer configuration
import { createProduct, deleteProduct, updateProduct, viewProducts, viewProduct,SuggestProduct, getNotifications } from '../controller/product.controller.js';

const router = express.Router();

router.post('/create', verifyAdmin, upload.array("images", 5), createProduct);
router.get('/view/:id', viewProduct);
router.put('/update/:id', verifyAdmin, upload.array("images", 5) , updateProduct);
router.delete('/delete/:id', verifyAdmin, deleteProduct);
router.get('/view', viewProducts);
router.get('/notifications', getNotifications);
    export default router;

    