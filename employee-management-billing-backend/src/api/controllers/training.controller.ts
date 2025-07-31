import { Request, Response } from 'express';
import * as trainingService from '../services/training.service';

export const getAllTrainings = async (req: Request, res: Response) => {
  const trainings = await trainingService.getAllTrainings();
  res.json(trainings);
};

export const createTraining = async (req: Request, res: Response) => {
  const training = await trainingService.createTraining(req.body);
  res.status(201).json(training);
};

export const updateTraining = async (req: Request, res: Response) => {
  const training = await trainingService.updateTraining(req.params.id, req.body);
  res.json(training);
};

export const deleteTraining = async (req: Request, res: Response) => {
  await trainingService.deleteTraining(req.params.id);
  res.status(204).send();
};

export const enrollInTraining = async (req: Request, res: Response) => {
  const enrollment = await trainingService.enrollInTraining(req.params.id, req.body.userId);
  res.status(201).json(enrollment);
};

export const approveTrainingEnrollment = async (req: Request, res: Response) => {
  const result = await trainingService.approveTrainingEnrollment(req.params.id, req.params.enrollmentId, req.body.approve);
  res.json(result);
};
