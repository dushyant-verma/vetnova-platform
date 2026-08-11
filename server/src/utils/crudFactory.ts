import { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';

export const crudFactory = (model: Model<any>, populateOpts?: any) => {
  return {
    getAll: async (req: Request, res: Response) => {
      try {
        const { search, searchFields, category, status, featured } = req.query;
        let query: any = {};
        
        if (status) {
          query.status = { $regex: new RegExp(`^${status}$`, 'i') };
        }

        if (category && category !== 'all') {
          query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        if (featured !== undefined) {
          query.isFeatured = featured === 'true';
        }

        if (search) {
          const fields = searchFields ? (searchFields as string).split(',') : ['title', 'excerpt', 'content', 'category'];
          query.$or = fields.map((field) => ({
            [field]: { $regex: search, $options: 'i' }
          }));
        }

        let dbQuery = model.find(query).sort({ createdAt: -1 });
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
        const idOrSlug = String(req.params.id);
        let doc: any = null;

        if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
          let dbQuery = model.findById(idOrSlug);
          if (populateOpts) {
            dbQuery = dbQuery.populate(populateOpts);
          }
          doc = await dbQuery;
        }

        if (!doc) {
          let dbQuery = model.findOne({ slug: idOrSlug });
          if (populateOpts) {
            dbQuery = dbQuery.populate(populateOpts);
          }
          doc = await dbQuery;
        }

        if (!doc) {
          let dbQuery = model.findOne({ slug: { $regex: new RegExp(`^${idOrSlug}$`, 'i') } });
          if (populateOpts) {
            dbQuery = dbQuery.populate(populateOpts);
          }
          doc = await dbQuery;
        }

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
