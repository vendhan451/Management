import { Router } from 'express';
import * as brandingController from '../controllers/branding.controller';

const router = Router();

router.put('/', brandingController.updateBranding);
router.get('/', brandingController.getBranding);

export default router;
