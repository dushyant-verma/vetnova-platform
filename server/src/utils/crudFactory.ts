import { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';

export const crudFactory = (model: Model<any>, populateOpts?: any) => {
  return {
    getAll: async (req: Request, res: Response) => {
      try {
        const { search, searchFields, category, status, featured, program, public: isPublic } = req.query;
        let query: any = {};
        
        if (status) {
          query.status = { $regex: new RegExp(`^${status}$`, 'i') };
        } else if (isPublic === 'true') {
          query.status = 'Published';
        }

        if (category && category !== 'all') {
          query.$or = [
            { category: { $regex: new RegExp(`^${category}$`, 'i') } },
            { categories: { $regex: new RegExp(`^${category}$`, 'i') } }
          ];
        }

        if (program && program !== 'all') {
          query.programs = { $regex: new RegExp(`^${program}$`, 'i') };
        }

        if (featured !== undefined) {
          query.isFeatured = featured === 'true';
        }

        if (search) {
          const fields = searchFields ? (searchFields as string).split(',') : ['name', 'title', 'excerpt', 'content', 'category', 'specialization', 'department', 'designation'];
          query.$or = fields.map((field) => ({
            [field]: { $regex: search, $options: 'i' }
          }));
        }

        const hasDisplayOrder = model.schema.path('displayOrder') !== undefined;
        const sortOptions: any = hasDisplayOrder ? { displayOrder: 1, createdAt: -1 } : { createdAt: -1 };

        let dbQuery = model.find(query).sort(sortOptions);
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
        const docToDelete = await model.findById(req.params.id);
        if (!docToDelete) {
          return res.status(404).json({ message: 'Not found' });
        }

        // Safe cleanup when deleting a BlogCategory
        if (model.modelName === 'BlogCategory') {
          const BlogModel = mongoose.models.Blog;
          const CategoryModel = model;
          
          if (BlogModel) {
            const catName = docToDelete.name;
            const catSlug = docToDelete.slug;
            
            // Reassign affected blogs to GENERAL
            await BlogModel.updateMany(
              {
                $or: [
                  { category: { $regex: new RegExp(`^${catName}$`, 'i') } },
                  { category: { $regex: new RegExp(`^${catSlug}$`, 'i') } }
                ]
              },
              { $set: { category: 'GENERAL' } }
            );

            // Ensure GENERAL category exists in database
            const generalExists = await CategoryModel.findOne({ name: { $regex: /^GENERAL$/i } });
            if (!generalExists) {
              await CategoryModel.create({
                name: 'GENERAL',
                slug: 'general',
                description: 'General articles and announcements',
                status: 'Published'
              });
            }
          }
        }

        await model.findByIdAndDelete(req.params.id);
        res.json({ message: 'Removed successfully' });
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    }
  };
};
