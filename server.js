const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");


const app = express();

app.use(cors());
app.use(express.json());

// اتصال MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "authdb"
});

db.connect(err => {
  if(err) console.log(err);
  else console.log("MySQL Connected");
});

// تسجيل
app.post("/register", async (req, res) => {
  const {username, email, password} = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword],
    (err, result) => {
      if(err) return res.send("Error");
      res.send("User registered");
    }
  );
});

// تسجيل دخول
app.post("/login", (req, res) => {
  const {email, password} = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if(err) return res.send("Error");

      if(results.length === 0){
        return res.send("User not found");
      }

      const user = results[0];

      const match = await bcrypt.compare(password, user.password);

      if(match){
        res.send("Login successful");
      } else {
        res.send("Wrong password");
      }
    }
  );
});
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
//AUTH
// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: "User registered", userId: user.id });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Wrong password" });
    }

    res.json({ 
      message: "Login successful", 
      userId: user.id,
      username: user.username 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
