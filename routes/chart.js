import express from 'express';
import { chart } from '../controller/chartController.js';

const router = express.Router();
router.get('/:user_id/chart',chart)

export default router;