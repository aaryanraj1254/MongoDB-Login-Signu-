require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const collection = require("./mongoDb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const templatePath = path.join(__dirname, "../templates");

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));

// This code helps the server understand the data sent from a form (like a login form) so it can use that data.
// Think of it like a translator that helps the server make sense of the information sent from the form.

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.name,
    password: req.body.password
  }
  //giving data to mongodb
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  data.password = hashedPassword;

  await collection.insertMany([data]);
  res.render("login"); // Redirect to the login page after signing up
});

app.post("/login", async (req, res) => {
  try {
    const user = await collection.findOne({ name: req.body.name });
    if (!user) {
      return res.send("User not found");
    }

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return res.send("Invalid password");
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h"
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error logging in");
  }
});

app.get("/home", authenticateToken, (req, res) => {
  res.render("Home");
});

function authenticateToken(req, res, next) {
  const token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid token");
    }

    req.userId = decoded._id;
    next();
  });
}

const createtoken = async () => {
  const token = await jwt.sign({ _id: "2131313131" }, "mynameisaaryanraj");
  console.log(token);

  const userVer = jwt.verify(token, "mynameisaaryanraj");
  console.log(userVer)
}
createtoken();

const securePassword = async (password) => {
  const passwordHash = await bcrypt.hash(password, 10);
  console.log(passwordHash);

  const passwordmatch = await bcrypt.compare(password, passwordHash);
  console.log(passwordmatch);
}
securePassword("aaryan@123");

app.listen(3000, () => {
  console.log("Server listening on port 3000");
}); 