import express from 'express';
import { earning } from '../controller/earningsController.js';

const router = express.Router();
router.get('/:user_id', earning);

export default router
