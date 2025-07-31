import { Request, Response } from 'express';
import * as projectService from '../services/project.service';

export const createProject = async (req: Request, res: Response) => {
    try {
        const newProject = await projectService.createProject(req.body);
        res.status(201).json(newProject);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error creating project', error: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
};

export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await projectService.getAllProjects();
        res.status(200).json(projects);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error fetching projects', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    const projectId = req.params.projectId;
    try {
        const project = await projectService.getProjectById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error fetching project', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const updateProject = async (req: Request, res: Response) => {
    const projectId = req.params.projectId;
    try {
        const updatedProject = await projectService.updateProject(projectId, req.body);
        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(updatedProject);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error updating project', error: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
};

export const deleteProject = async (req: Request, res: Response) => {
    const projectId = req.params.projectId;
    try {
        const deleted = await projectService.deleteProject(projectId);
        if (!deleted) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(204).send();
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error deleting project', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};
