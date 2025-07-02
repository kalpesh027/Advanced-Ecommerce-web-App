import express from 'express';
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import{  getDashboardData } from '../controller/admin.totalIncome.js';

const router = express.Router();


router.get('/daily-income',verifyAdmin, getDashboardData);




export default router;
