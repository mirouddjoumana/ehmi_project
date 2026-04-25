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
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
