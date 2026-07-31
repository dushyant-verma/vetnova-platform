import { Request, Response } from 'express';
import { Model } from 'mongoose';

export const crudFactory = (model: Model<any>, populateOpts?: any) => {
  return {
    getAll: async (req: Request, res: Response) => {
      try {
        const { search, searchFields } = req.query;
        let query = {};
        
        if (search && searchFields) {
          const fields = (searchFields as string).split(',');
          query = {
            $or: fields.map((field) => ({
              [field]: { $regex: search, $options: 'i' }
            }))
          };
        }

        let dbQuery = model.find(query);
        if (populateOpts) {
          dbQuery = dbQuery.populate(populateOpts);
        }
        
        const docs = await dbQuery;
        res.json(docs);
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    },
    
    getOne: async (req: Request, res: Response) => {
      try {
        let dbQuery = model.findById(req.params.id);
        if (populateOpts) {
          dbQuery = dbQuery.populate(populateOpts);
        }
        const doc = await dbQuery;
        if (doc) res.json(doc);
        else res.status(404).json({ message: 'Not found' });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
    },
    
    createOne: async (req: Request, res: Response) => {
      try {
        const doc = await model.create(req.body);
        res.status(201).json(doc);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    },
    
    updateOne: async (req: Request, res: Response) => {
      try {
        const doc = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(doc);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    },
    
    deleteOne: async (req: Request, res: Response) => {
      try {
        await model.findByIdAndDelete(req.params.id);
        res.json({ message: 'Removed successfully' });
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    }
  };
};
