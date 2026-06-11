import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFilePath = path.join(__dirname, '..', 'data', 'local_db.json');

const ensureDbFile = () => {
  const dir = path.dirname(dbFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dbFilePath)) {
    const initialData = {
      reservations: [],
      menuItems: [],
      subscribers: [],
      reviews: [],
      offers: []
    };
    fs.writeFileSync(dbFilePath, JSON.stringify(initialData, null, 2), 'utf-8');
  }
};

const readDb = () => {
  ensureDbFile();
  const data = fs.readFileSync(dbFilePath, 'utf-8');
  return JSON.parse(data);
};

const writeDb = (data) => {
  ensureDbFile();
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

export const jsonDb = {
  get: (collection) => {
    const db = readDb();
    return db[collection] || [];
  },
  
  getById: (collection, id) => {
    const db = readDb();
    const list = db[collection] || [];
    return list.find(item => item._id === id || item.id === id);
  },
  
  create: (collection, item) => {
    const db = readDb();
    if (!db[collection]) db[collection] = [];
    const newItem = {
      _id: 'local_' + Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      ...item
    };
    db[collection].push(newItem);
    writeDb(db);
    return newItem;
  },
  
  update: (collection, id, data) => {
    const db = readDb();
    if (!db[collection]) return null;
    const index = db[collection].findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    db[collection][index] = { ...db[collection][index], ...data, updatedAt: new Date().toISOString() };
    writeDb(db);
    return db[collection][index];
  },
  
  delete: (collection, id) => {
    const db = readDb();
    if (!db[collection]) return false;
    const initialLength = db[collection].length;
    db[collection] = db[collection].filter(item => item._id !== id && item.id !== id);
    writeDb(db);
    return db[collection].length < initialLength;
  }
};
export default jsonDb;
