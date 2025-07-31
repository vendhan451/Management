import { Request, Response } from 'express';
import * as clientPortalService from '../services/client-portal.service';

export const getClientProjects = async (req: Request, res: Response) => {
  const projects = await clientPortalService.getClientProjects(req.query);
  res.json(projects);
};

export const getClientBilling = async (req: Request, res: Response) => {
  const billing = await clientPortalService.getClientBilling(req.query);
  res.json(billing);
};
