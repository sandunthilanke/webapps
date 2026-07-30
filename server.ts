import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const CSV_FILE_PATH = path.join(process.cwd(), 'names.csv');

  // Initialize CSV with headers if it doesn't exist
  try {
    await fs.access(CSV_FILE_PATH);
  } catch {
    await fs.writeFile(CSV_FILE_PATH, 'Name,Timestamp\n', 'utf-8');
  }

  // API Route to save a name
  app.post('/api/names', async (req, res) => {
    try {
      const { name } = req.body;
      if (!name || typeof name !== 'string') {
        res.status(400).json({ error: 'Name is required' });
        return;
      }
      
      const timestamp = new Date().toISOString();
      const escapedName = name.replace(/"/g, '""');
      const csvLine = `"${escapedName}","${timestamp}"\n`;
      
      await fs.appendFile(CSV_FILE_PATH, csvLine, 'utf-8');
      res.json({ success: true });
    } catch (error) {
      console.error('Error saving name:', error);
      res.status(500).json({ error: 'Failed to save name' });
    }
  });

  // API Route to download the CSV
  app.get('/api/names/download', (req, res) => {
    res.download(CSV_FILE_PATH, 'names.csv');
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
