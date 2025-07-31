import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { clockInSchema } from '../validators/attendance.validators';
import { clockIn, clockOut, getStatus } from '../controllers/attendance.controller';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Clock In
router.post('/clock-in', authenticateJWT, validate(clockInSchema), clockIn);

// Clock Out
router.post('/clock-out', authenticateJWT, clockOut);

// Get Attendance Status
router.get('/status/me', authenticateJWT, getStatus);

export default router;
