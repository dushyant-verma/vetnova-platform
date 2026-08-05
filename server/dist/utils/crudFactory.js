"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crudFactory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const crudFactory = (model, populateOpts) => {
    return {
        getAll: async (req, res) => {
            try {
                const { search, searchFields, category, status, featured } = req.query;
                let query = {};
                if (status) {
                    query.status = status;
                }
                if (category && category !== 'all') {
                    query.category = { $regex: new RegExp(`^${category}$`, 'i') };
                }
                if (featured !== undefined) {
                    query.isFeatured = featured === 'true';
                }
                if (search) {
                    const fields = searchFields ? searchFields.split(',') : ['title', 'excerpt', 'content', 'category'];
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
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
        getOne: async (req, res) => {
            try {
                const idOrSlug = String(req.params.id);
                let doc = null;
                if (mongoose_1.default.Types.ObjectId.isValid(idOrSlug)) {
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
                if (doc)
                    res.json(doc);
                else
                    res.status(404).json({ message: 'Not found' });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
        createOne: async (req, res) => {
            try {
                const doc = await model.create(req.body);
                res.status(201).json(doc);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        },
        updateOne: async (req, res) => {
            try {
                const doc = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
                res.json(doc);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        },
        deleteOne: async (req, res) => {
            try {
                await model.findByIdAndDelete(req.params.id);
                res.json({ message: 'Removed successfully' });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        }
    };
};
exports.crudFactory = crudFactory;
//# sourceMappingURL=crudFactory.js.map