import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import User from "./schema/user.js";
import uid2 from "uid2";
import bcrypt from "bcrypt";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import crypto from "crypto";

dotenv.config();

mongoose
    .connect(
        `mongodb://127.0.0.1:27017/file`
    )
    .then(() => {
        console.log("connected success");
    })
    .catch((err) => console.error(err));

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));

const storage = new GridFsStorage({
    url: `mongodb+srv://${process.env.AUTH_DB}/?retryWrites=true&w=majority`,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        const filename = `${Date.now()}-${file.originalname}`;
        const fileInfo = {
          filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    },
  });
  
  const upload = multer({ storage });

app.get("/", (req, res) => res.json("Enter"));

app.post("/register", async (req, res) => {
    try {
      const { user, password } = req.body;
      if (!user || !password) {
        return res.status(400).json({ error: "The user or password is not defined" });
      }
      const existingUser = await User.findOne({ email: user });
      if (existingUser) {
        return res.status(400).json("User already exists");
      }
      const newUser = new User({
        email: user,
        password: bcrypt.hashSync(password, 10),
        token: uid2(32),
        totalUploadSize: 0,
      });
      await newUser.save();
      res.json({
        message: "User is created",
        token: newUser.token   // renvoi du token pour test
    });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

app.post("/login", (req, res) => {
    try {
        const user = req.body.user;
        const password = req.body.password;
        const token = req.body.token;
    
        if (!user || !password || !token) {
            throw new Error("Missing or empty fields" );
        }
    
        User.findOne({ email: user  }).then((data) => {
            if (!data || !bcrypt.compareSync(req.body.password, data.password)) {
                throw new Error("Failed login");
            }
    
            res.json({ token: data.token });
        });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});


app.post("/upload", upload.single("file"), async (req, res) => {
    try {
      const userToken = req.header("Authorization").replace("Bearer ", "");
      const user = await User.findOne({ token: userToken });
      if (!user) return res.status(403).json({ error: "Unauthorized" });
      const fileSize = req.file.size;
      const maxSize = 2 * 1024 * 1024 * 1024;
      if (user.totalUploadSize + fileSize > maxSize) {
        return res.status(400).json({ error: "Storage limit exceeded (2GB)" });
      }
      user.totalUploadSize += fileSize;
      await user.save();
  
      res.json({ message: "File uploaded successfully", file: req.file });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
