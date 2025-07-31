import { Request, Response } from 'express';
import * as cameraService from '../services/camera.service';

export const uploadImage = async (req: Request, res: Response) => {
  const image = await cameraService.uploadImage(req.file);
  res.status(201).json(image);
};

export const getImages = async (req: Request, res: Response) => {
  const images = await cameraService.getImages(req.query);
  res.json(images);
};
