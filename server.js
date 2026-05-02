const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// MySQL connection for auth
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "authdb"
});

db.connect(err => {
  if(err) console.log("MySQL Auth Error:", err);
  else console.log("MySQL Auth Connected");
});

// Register new user
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword],
    (err, result) => {
      if(err) return res.status(500).json({ error: "Registration failed" });
      res.json({ message: "User registered" });
    }
  );
});

// Login user
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if(err) return res.status(500).json({ error: "Login error" });
      if(results.length === 0) return res.status(404).json({ error: "User not found" });
      
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      
      if(match) {
        res.json({ 
          message: "Login successful", 
          userId: user.id,
          username: user.username 
        });
      } else {
        res.status(401).json({ error: "Wrong password" });
      }
    }
  );
});

// Serve frontend files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start auth server
app.listen(5000, () => {
  console.log("Auth Server running on http://localhost:5000");
});
