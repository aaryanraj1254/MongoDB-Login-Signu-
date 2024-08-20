const mongoose = require("mongoose");

// Connect to the MongoDB database
mongoose.connect("mongodb+srv://Aaryan:1234@cluster0.vufv5.mongodb.net/userdetails")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(() => {
        console.log("Failed to connect to MongoDB");
    });

// Creating a schema for the structure of your database
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Creating a collection (model)
const collection = new mongoose.model("Collection1", LoginSchema);

module.exports = collection;
