import { Request, Response } from 'express';
import { Program } from '../models/Program';

export const getPrograms = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const query = search ? { title: { $regex: search as string, $options: 'i' } } : {};
    const programs = await Program.find(query).populate('faculty', 'name specialization image');
    res.json(programs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProgramById = async (req: Request, res: Response): Promise<void> => {
  try {
    const program = await Program.findById(req.params.id).populate('faculty');
    if (program) {
      res.json(program);
    } else {
      res.status(404).json({ message: 'Program not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProgram = async (req: Request, res: Response) => {
  try {
    const program = new Program(req.body);
    const createdProgram = await program.save();
    res.status(201).json(createdProgram);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProgram = async (req: Request, res: Response) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(program);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProgram = async (req: Request, res: Response) => {
  try {
    await Program.findByIdAndDelete(req.params.id);
    res.json({ message: 'Program removed' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
