import express from 'express';
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import upload from '../cloud/multerConfig.js'; // Correctly import multer configuration
import { createAdvertisement, getallAdvertisements, getAdvertisement, updateAdvertisement, deleteAdvertisement } from '../controller/advertisement.controller.js'
import { createSectionTitle, getAllSectionTitles, updateSectionTitle, deleteSectionTitle } from '../controller/sectionTitle.controller.js';
const router = express.Router();

router.post('/create', createSectionTitle);
router.get('/view', getAllSectionTitles);
router.put('/update/:id', updateSectionTitle);
router.delete('/delete/:id', deleteSectionTitle);

export default router;
