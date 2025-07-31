import { Request, Response } from 'express';
import * as brandingService from '../services/branding.service';

export const updateBranding = async (req: Request, res: Response) => {
  const branding = await brandingService.updateBranding(req.body);
  res.status(200).json(branding);
};

export const getBranding = async (req: Request, res: Response) => {
  const branding = await brandingService.getBranding();
  res.json(branding);
};
