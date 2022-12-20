import { Router } from 'express';

import authRoutes from './auth';
import allergyRoutes from './allergies';

const router = Router();

router.use('/', authRoutes);
router.use('/allergies', allergyRoutes);

export default router;