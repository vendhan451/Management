import { Router } from 'express';
import * as gpsController from '../controllers/gps.controller';

const router = Router();

router.post('/log', gpsController.logLocation);
router.get('/', gpsController.getLocations);

export default router;
