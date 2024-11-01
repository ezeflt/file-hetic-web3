import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import User from "./schema/user.js";
import File from "./schema/file.js";
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
const storage = multer.memoryStorage();
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
            throw new Error("Missing or empty fields");
        }

        User.findOne({ email: user }).then((data) => {
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
        const newFile = new File({
            filename: req.file.originalname,
            size: req.file.size,
            userId: user._id, // Assurez-vous que cela correspond à l'ID de l'utilisateur
        });

        await newFile.save(); // Enregistrez le fichier dans la base de données

        res.json({ message: "File uploaded successfully", file: newFile });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


app.get("/files", async (req, res) => {
    try {
        const userToken = req.header("Authorization").replace("Bearer ", "");
        const user = await User.findOne({ token: userToken });

        if (!user) return res.status(403).json({ error: "Unauthorized" });
        const files = await File.find({ userId: user._id });
        res.json(files);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


app.get("/files/:fileId", async (req, res) => {
    try {
        const userToken = req.header("Authorization").replace("Bearer ", "");
        const user = await User.findOne({ token: userToken });

        if (!user) return res.status(403).json({ error: "Unauthorized" });

        const file = await File.findOne({ _id: req.params.fileId, userId: user._id });
        if (!file) return res.status(404).json({ error: "File not found" });

        res.json({ filename: file.filename, size: file.size, uploadDate: file.uploadDate, metadata: file.metadata });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


app.delete("/files/:fileId", async (req, res) => {
    try {
        const userToken = req.header("Authorization").replace("Bearer ", "");
        const user = await User.findOne({ token: userToken });

        if (!user) return res.status(403).json({ error: "Unauthorized" });

        const file = await File.findOne({ _id: req.params.fileId, userId: user._id });
        if (!file) return res.status(404).json({ error: "File not found" });

        // Supprimer le fichier et mettre à jour la taille totale d'upload de l'utilisateur
        await File.deleteOne({ _id: req.params.fileId });
        user.totalUploadSize -= file.size;
        await user.save();

        res.json({ message: "File deleted successfully" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

