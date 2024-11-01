import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' })

dotenv.config();

// mongoose.connect(`mongodb+srv://${process.env.AUTH_DB}/?retryWrites=true&w=majority&appName=Cluster0/files`)
//     .then(() => {
//         console.log('connected success');
//     })
//     .catch((err) => console.error(err));

const app = express().use(express.json());

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
      return res.status(400).send('No file uploaded');
  }
  console.log(req.file);
  res.send(`File uploaded as ${req.file.originalname} `);
});























app.get('/', (req, res) => {
    res.send(`
      <h2>File Upload With <code>"Nodednjlgkjdlfgjk.js"</code></h2>
      <form action="/api/upload" enctype="multipart/form-data" method="post">
        <div>Select a file: 
          <input type="file" name="file" multiple="multiple" />
        </div>
        <input type="submit" value="Upload" />
      </form>
  
    `);
  });
  
  