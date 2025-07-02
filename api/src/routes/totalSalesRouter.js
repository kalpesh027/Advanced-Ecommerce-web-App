import express from 'express';
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import{ getTotalOnlineSale } from '../controller/getSales.controller.js';

const router = express.Router();


router.get('/total_sales',verifyAdmin, getTotalOnlineSale);




export default router;
 