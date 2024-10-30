import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' })

dotenv.config();

mongoose.connect(`mongodb+srv://${process.env.AUTH_DB}/?retryWrites=true&w=majority&appName=Cluster0/files`)
    .then(() => {
        console.log('connected success');
    })
    .catch((err) => console.error(err));

const app = express().use(express.json());

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));


app.post('/api/upload', upload.array('file'), (req, res)=> {
console.log("test");

});





















app.get('/', (req, res) => {
    res.send(`
      <h2>File Upload With <code>"Node.js"</code></h2>
      <form action="/api/upload" enctype="multipart/form-data" method="post">
        <div>Select a file: 
          <input type="file" name="file" multiple="multiple" />
        </div>
        <input type="submit" value="Upload" />
      </form>
  
    `);
  });
  
  