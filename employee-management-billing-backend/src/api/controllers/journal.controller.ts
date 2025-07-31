import { Request, Response } from 'express';
import * as journalService from '../services/journal.service';

export const createJournalEntry = async (req: Request, res: Response) => {
  const entry = await journalService.createJournalEntry(req.body);
  res.status(201).json(entry);
};

export const getJournalEntries = async (req: Request, res: Response) => {
  const entries = await journalService.getJournalEntries(req.query);
  res.json(entries);
};
