const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
require('dotenv').config();
const port=process.env.PORT|8080;

mongoose.connect(process.env.MOGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connection successfully established"))
    .catch((err) => console.error("Connection failed:", err));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const User = mongoose.model("User", userSchema);
app.post("/login", async (req, res) => {
    // console.log('Helob');
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email: email });

        // Check if user exists
        if (!user) {
            console.log("User not found");
            return res.status(200).send({ message: "User not found", user: user });
        }

        // Check if password matches
        if (user.password !== password) {
            console.log("Paasword did not match");
            return res.status(500).send({ message: "Incorrect Password", user: user });

        }

        // Login successful
        res.status(200).send({ message: "Login successful", user: user });
        console.log("Login succesfully");
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send({ mesaage: "User already exists" });
        }

        // Create a new user
        const newUser = new User({
            name,
            email,
            password
        });

        // Save the new user to the database
        const savedUser = await newUser.save();
        res.status(201).send({ message: "Successfully registered", user: savedUser });
        console.log("Registered succesfully, Please login now");
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Backend server started at port ${port}`);
});



