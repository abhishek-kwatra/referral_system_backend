import express from 'express';
import { referral } from '../controller/referral.js';

const router = express.Router();
router.get('/:id/referrals',referral);

export default router;
