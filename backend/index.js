import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import User from "./schema/user.js";
import uid2 from "uid2";
import bcrypt from "bcrypt";

dotenv.config();

mongoose
    .connect(
        `mongodb+srv://${process.env.AUTH_DB}/?retryWrites=true&w=majority&appName=Cluster0/files`
    )
    .then(() => {
        console.log("connected success");
    })
    .catch((err) => console.error(err));

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));

app.get("/", (req, res) => res.json("Enter"));

app.post("/register", (req, res) => {
    try {
        console.log("Entered /register route");

        const user = req.body.user;
        const password = req.body.password;

        if (!user || !password) {
            return res
                .status(400)
                .json({ error: "The user or password is not defined" });
        }

        User.findOne({ email: user }).then((data) => {
            if (!data) {
                const newUser = new User({
                    email: user,
                    password: bcrypt.hashSync(password, 10),
                    token: uid2(32),
                });

                newUser
                    .save()
                    .then(() => res.json("User is created"))
                    .catch((e) => res.status(500).json({ error: e.message }));
            } else {
                res.json("User already exists");
            }
        });
    } catch (e) {
        res.status(500).json({
            error: "Failed to register",
            details: e.message,
        });
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
    
        User.findOne({ username: req.body.username }).then((data) => {
            if (!data || !bcrypt.compareSync(req.body.password, data.password)) {
                throw new Error("Failed login");
            }
    
            res.json({ token: data.token });
        });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});
