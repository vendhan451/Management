import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { createWorkReportSchema, updateWorkReportSchema } from '../validators/work-report.validators';
import * as workReportController from '../controllers/work-report.controller';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// POST /work-reports - Create a new daily work report
router.post('/', authenticateJWT, validate(createWorkReportSchema), workReportController.createWorkReport);

// PUT /work-reports - Update an existing daily work report
router.put('/:reportId', authenticateJWT, validate(updateWorkReportSchema), workReportController.updateWorkReport);

export default router;
