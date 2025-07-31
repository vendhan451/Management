import { Request, Response } from 'express';
import * as gpsService from '../services/gps.service';

export const logLocation = async (req: Request, res: Response) => {
  const location = await gpsService.logLocation(req.body);
  res.status(201).json(location);
};

export const getLocations = async (req: Request, res: Response) => {
  const locations = await gpsService.getLocations(req.query);
  res.json(locations);
};
