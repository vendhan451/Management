import { Router } from 'express';
import * as fcmController from '../controllers/fcm.controller';

const router = Router();

router.post('/register', fcmController.registerFcmToken);
router.post('/admin-broadcast', fcmController.adminBroadcast);

export default router;
