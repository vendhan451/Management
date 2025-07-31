import { Router } from 'express';
import { getCompanyDetails, updateCompanyDetails, uploadLogo } from '../controllers/company/company.controller';

const router = Router();

router.get('/', getCompanyDetails);
router.put('/', updateCompanyDetails);
router.post('/logo', uploadLogo);

export default router;
