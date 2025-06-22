import express from 'express';
import { purchases } from '../controller/purchaseController.js';

const router = express.Router();
router.post('/purchase',purchases);

export default router;
