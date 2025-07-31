import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { leaveRequestSchema, cancelLeaveRequestSchema } from '../validators/leave-request.validators';
import * as leaveRequestController from '../controllers/leave-request.controller';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Create a new leave request
router.post('/', authenticateJWT, validate(leaveRequestSchema), leaveRequestController.createLeaveRequest);

// Cancel a leave request
router.put('/:requestId/cancel', authenticateJWT, validate(cancelLeaveRequestSchema), leaveRequestController.cancelLeaveRequest);

export default router;
