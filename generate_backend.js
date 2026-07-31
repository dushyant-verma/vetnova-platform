const fs = require('fs');
const path = require('path');

const modules = [
  { name: 'Blog', lower: 'blog', plural: 'blogs', modelPath: '../models/Blog' },
  { name: 'Event', lower: 'event', plural: 'events', modelPath: '../models/Event' },
  { name: 'Expert', lower: 'expert', plural: 'experts', modelPath: '../models/Expert' },
  { name: 'Application', lower: 'application', plural: 'applications', modelPath: '../models/Application' },
  { name: 'User', lower: 'user', plural: 'users', modelPath: '../models/User' }
];

const generateController = (m) => `import { Request, Response } from 'express';
import ${m.name} from '${m.modelPath}';

export const get${m.name}s = async (req: Request, res: Response) => {
  try {
    const filters = req.query || {};
    const items = await ${m.name}.find(filters).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const get${m.name}ById = async (req: Request, res: Response) => {
  try {
    const item = await ${m.name}.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const create${m.name} = async (req: Request, res: Response) => {
  try {
    const newItem = new ${m.name}(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const update${m.name} = async (req: Request, res: Response) => {
  try {
    const updatedItem = await ${m.name}.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedItem) return res.status(404).json({ message: 'Not found' });
    res.json(updatedItem);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const delete${m.name} = async (req: Request, res: Response) => {
  try {
    const deletedItem = await ${m.name}.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
`;

const generateRoute = (m) => `import express from 'express';
import { get${m.name}s, get${m.name}ById, create${m.name}, update${m.name}, delete${m.name} } from '../controllers/${m.lower}Controller';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(get${m.name}s)
  .post(protect, admin, create${m.name});

router.route('/:id')
  .get(get${m.name}ById)
  .put(protect, admin, update${m.name})
  .delete(protect, admin, delete${m.name});

export default router;
`;

const controllersDir = path.join(__dirname, 'server/src/controllers');
const routesDir = path.join(__dirname, 'server/src/routes');

modules.forEach(m => {
  fs.writeFileSync(path.join(controllersDir, m.lower + 'Controller.ts'), generateController(m));
  console.log('Created ' + m.lower + 'Controller.ts');
  
  let routeContent = generateRoute(m);
  if (m.name === 'Application') {
      routeContent = `import express from 'express';
import { getApplications, getApplicationById, createApplication, updateApplication, deleteApplication } from '../controllers/applicationController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, admin, getApplications) // Protected
  .post(createApplication); // Public

router.route('/:id')
  .get(protect, admin, getApplicationById)
  .put(protect, admin, updateApplication)
  .delete(protect, admin, deleteApplication);

export default router;
`
  }
  fs.writeFileSync(path.join(routesDir, m.lower + 'Routes.ts'), routeContent);
  console.log('Created ' + m.lower + 'Routes.ts');
});
