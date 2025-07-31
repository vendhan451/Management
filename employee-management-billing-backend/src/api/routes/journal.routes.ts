import { Router } from 'express';
import * as journalController from '../controllers/journal.controller';

const router = Router();

router.post('/', journalController.createJournalEntry);
router.get('/', journalController.getJournalEntries);

export default router;
