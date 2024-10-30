import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(`mongodb+srv://${process.env.AUTH_DB}/?retryWrites=true&w=majority&appName=Cluster0/files`)
    .then(() => {
        console.log('connected success');
    })
    .catch((err) => console.error(err));

const app = express().use(express.json());

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));
