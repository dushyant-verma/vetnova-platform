"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crudFactory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const escapeRegex = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};
const getParamId = (req) => {
    const rawId = req.params.id;
    return Array.isArray(rawId) ? rawId[0] : String(rawId || '');
};
const sanitizeRichHtml = (htmlContent) => {
    return (0, sanitize_html_1.default)(htmlContent, {
        allowedTags: sanitize_html_1.default.defaults.allowedTags.concat([
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'table', 'thead', 'tbody',
            'tr', 'th', 'td', 'u', 'sub', 'sup', 'figure', 'figcaption'
        ]),
        allowedAttributes: {
            '*': ['class', 'style', 'id', 'align'],
            'a': ['href', 'name', 'target', 'rel'],
            'img': ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading']
        },
        allowedSchemes: ['http', 'https', 'mailto', 'tel'],
        allowedSchemesByTag: {
            a: ['http', 'https', 'mailto', 'tel'],
            img: ['http', 'https', 'data']
        },
        allowProtocolRelative: false
    });
};
const sanitizeInputBody = (body) => {
    if (!body || typeof body !== 'object')
        return body;
    const sanitized = Array.isArray(body) ? [...body] : { ...body };
    for (const key of Object.keys(sanitized)) {
        if (typeof sanitized[key] === 'string') {
            if (['content', 'bio', 'description', 'message', 'body', 'html'].includes(key)) {
                sanitized[key] = sanitizeRichHtml(sanitized[key]);
            }
        }
        else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
            sanitized[key] = sanitizeInputBody(sanitized[key]);
        }
    }
    return sanitized;
};
const cleanModelFields = (body, schema) => {
    if (!body || typeof body !== 'object')
        return body;
    const cleaned = { ...body };
    delete cleaned._id;
    delete cleaned.__v;
    delete cleaned.createdAt;
    delete cleaned.updatedAt;
    if (schema && typeof schema.eachPath === 'function') {
        schema.eachPath((pathName, schematype) => {
            const val = cleaned[pathName];
            if (val === '' || val === null) {
                const instance = schematype.instance;
                if (instance === 'ObjectID' || instance === 'Date') {
                    delete cleaned[pathName];
                }
            }
        });
    }
    return cleaned;
};
const crudFactory = (model, populateOpts) => {
    return {
        getAll: async (req, res) => {
            try {
                const { search, searchFields, category, status, featured, program, public: isPublic } = req.query;
                let query = {};
                if (status && typeof status === 'string') {
                    query.status = { $regex: new RegExp(`^${escapeRegex(status.trim())}$`, 'i') };
                }
                else if (isPublic === 'true') {
                    query.status = 'Published';
                }
                if (category && category !== 'all' && typeof category === 'string') {
                    const safeCategory = escapeRegex(category.trim());
                    query.$or = [
                        { category: { $regex: new RegExp(`^${safeCategory}$`, 'i') } },
                        { categories: { $regex: new RegExp(`^${safeCategory}$`, 'i') } }
                    ];
                }
                if (program && program !== 'all' && typeof program === 'string') {
                    query.programs = { $regex: new RegExp(`^${escapeRegex(program.trim())}$`, 'i') };
                }
                if (featured !== undefined) {
                    query.isFeatured = String(featured) === 'true';
                }
                if (search && typeof search === 'string') {
                    const safeSearch = escapeRegex(search.trim());
                    const fields = searchFields ? searchFields.split(',') : ['name', 'title', 'excerpt', 'content', 'category', 'specialization', 'department', 'designation'];
                    query.$or = fields.map((field) => ({
                        [field]: { $regex: safeSearch, $options: 'i' }
                    }));
                }
                const hasDisplayOrder = model.schema.path('displayOrder') !== undefined;
                const sortOptions = hasDisplayOrder ? { displayOrder: 1, createdAt: -1 } : { createdAt: -1 };
                let dbQuery = model.find(query).sort(sortOptions);
                if (model.modelName === 'User') {
                    dbQuery = dbQuery.select('-password');
                }
                if (populateOpts) {
                    dbQuery = dbQuery.populate(populateOpts);
                }
                const docs = await dbQuery;
                res.json(docs);
            }
            catch (error) {
                res.status(500).json({ message: 'Error retrieving records' });
            }
        },
        getOne: async (req, res) => {
            try {
                const idOrSlug = getParamId(req).trim();
                let doc = null;
                if (mongoose_1.default.Types.ObjectId.isValid(idOrSlug)) {
                    let dbQuery = model.findById(idOrSlug);
                    if (model.modelName === 'User') {
                        dbQuery = dbQuery.select('-password');
                    }
                    if (populateOpts) {
                        dbQuery = dbQuery.populate(populateOpts);
                    }
                    doc = await dbQuery;
                }
                if (!doc && idOrSlug) {
                    const safeSlug = escapeRegex(idOrSlug);
                    let dbQuery = model.findOne({ slug: idOrSlug });
                    if (model.modelName === 'User') {
                        dbQuery = dbQuery.select('-password');
                    }
                    if (populateOpts) {
                        dbQuery = dbQuery.populate(populateOpts);
                    }
                    doc = await dbQuery;
                    if (!doc) {
                        let dbQuery = model.findOne({ slug: { $regex: new RegExp(`^${safeSlug}$`, 'i') } });
                        if (model.modelName === 'User') {
                            dbQuery = dbQuery.select('-password');
                        }
                        if (populateOpts) {
                            dbQuery = dbQuery.populate(populateOpts);
                        }
                        doc = await dbQuery;
                    }
                }
                if (doc)
                    res.json(doc);
                else
                    res.status(404).json({ message: 'Record not found' });
            }
            catch (error) {
                res.status(500).json({ message: 'Error retrieving record details' });
            }
        },
        createOne: async (req, res) => {
            try {
                let sanitizedBody = sanitizeInputBody(req.body);
                sanitizedBody = cleanModelFields(sanitizedBody, model.schema);
                if (model.modelName === 'User' && sanitizedBody.role === 'super_admin') {
                    sanitizedBody.role = 'admin';
                }
                const doc = await model.create(sanitizedBody);
                const resultDoc = doc.toObject();
                if (resultDoc.password) {
                    delete resultDoc.password;
                }
                res.status(201).json(resultDoc);
            }
            catch (error) {
                res.status(400).json({ message: error.message || 'Error creating record' });
            }
        },
        updateOne: async (req, res) => {
            try {
                const id = getParamId(req);
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: 'Invalid ID format' });
                }
                let sanitizedBody = sanitizeInputBody(req.body);
                sanitizedBody = cleanModelFields(sanitizedBody, model.schema);
                if (model.modelName === 'User') {
                    if (sanitizedBody.role) {
                        const reqUserRole = req.user?.role;
                        if (sanitizedBody.role === 'super_admin' && reqUserRole !== 'super_admin') {
                            return res.status(403).json({ message: 'Only Super Admin can assign Super Admin role' });
                        }
                    }
                    if (sanitizedBody.password) {
                        if (!/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(sanitizedBody.password)) {
                            const salt = await bcryptjs_1.default.genSalt(10);
                            sanitizedBody.password = await bcryptjs_1.default.hash(sanitizedBody.password, salt);
                        }
                    }
                }
                const doc = await model.findByIdAndUpdate(id, sanitizedBody, { new: true, runValidators: true }).select('-password');
                if (!doc) {
                    return res.status(404).json({ message: 'Record not found' });
                }
                res.json(doc);
            }
            catch (error) {
                res.status(400).json({ message: error.message || 'Error updating record' });
            }
        },
        deleteOne: async (req, res) => {
            try {
                const id = getParamId(req);
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: 'Invalid ID format' });
                }
                const docToDelete = await model.findById(id);
                if (!docToDelete) {
                    return res.status(404).json({ message: 'Record not found' });
                }
                if (model.modelName === 'User') {
                    const reqUserId = req.user?._id?.toString();
                    const reqUserRole = req.user?.role;
                    if (docToDelete._id.toString() === reqUserId) {
                        return res.status(400).json({ message: 'Cannot delete your own user account' });
                    }
                    if (docToDelete.role === 'super_admin' && reqUserRole !== 'super_admin') {
                        return res.status(403).json({ message: 'Only Super Admin can delete a Super Admin user' });
                    }
                }
                if (model.modelName === 'BlogCategory') {
                    const BlogModel = mongoose_1.default.models.Blog;
                    const CategoryModel = model;
                    if (BlogModel) {
                        const catName = escapeRegex(docToDelete.name);
                        const catSlug = escapeRegex(docToDelete.slug);
                        await BlogModel.updateMany({
                            $or: [
                                { category: { $regex: new RegExp(`^${catName}$`, 'i') } },
                                { category: { $regex: new RegExp(`^${catSlug}$`, 'i') } }
                            ]
                        }, { $set: { category: 'GENERAL' } });
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
                await model.findByIdAndDelete(id);
                res.json({ message: 'Removed successfully' });
            }
            catch (error) {
                res.status(400).json({ message: error.message || 'Error deleting record' });
            }
        }
    };
};
exports.crudFactory = crudFactory;
//# sourceMappingURL=crudFactory.js.map