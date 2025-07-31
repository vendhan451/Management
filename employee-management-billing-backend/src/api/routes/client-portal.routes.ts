import { Router } from 'express';
import * as clientPortalController from '../controllers/client-portal.controller';

const router = Router();

router.get('/projects', clientPortalController.getClientProjects);
router.get('/billing', clientPortalController.getClientBilling);

export default router;
