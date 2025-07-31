import { Router } from 'express';
import * as trainingController from '../controllers/training.controller';

const router = Router();

router.get('/', trainingController.getAllTrainings);
router.post('/', trainingController.createTraining);
router.put('/:id', trainingController.updateTraining);
router.delete('/:id', trainingController.deleteTraining);
router.post('/:id/enroll', trainingController.enrollInTraining);
router.put('/:id/enrollment/:enrollmentId/status', trainingController.approveTrainingEnrollment);

export default router;
