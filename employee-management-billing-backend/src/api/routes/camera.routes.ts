import { Router } from 'express';
import * as cameraController from '../controllers/camera.controller';

const router = Router();

router.post('/upload', cameraController.uploadImage);
router.get('/', cameraController.getImages);

export default router;
