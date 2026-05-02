const express = require("express");
const cors = require("cors");
const app = express();
const sequelize = require("./config/db");

// Import Models
const Level = require("./models/Level");
const Lesson = require("./models/Lesson");
const Progress = require("./models/Progress");
const Quiz = require("./models/Quiz");
const Result = require("./models/Result");

app.use(express.json());
app.use(cors());

// Relationships
Level.hasMany(Lesson, { foreignKey: "level_id" });
Lesson.belongsTo(Level, { foreignKey: "level_id" });

Level.hasMany(Quiz, { foreignKey: "level_id" });
Quiz.belongsTo(Level, { foreignKey: "level_id" });

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working ");
});


// ================= LEVEL =================

// CREATE LEVEL
app.post("/levels", async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ error: "Title required" });
    }

    const level = await Level.create({
      title: req.body.title
    });

    res.json(level);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL LEVELS
app.get("/levels", async (req, res) => {
  try {
    const levels = await Level.findAll();
    res.json(levels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE LEVEL
app.put("/levels/:id", async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ error: "Title required" });
    }

    await Level.update(
      { title: req.body.title },
      { where: { id: req.params.id } }
    );

    res.json({ message: "Level updated" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE LEVEL
app.delete("/levels/:id", async (req, res) => {
  try {
    await Level.destroy({
      where: { id: req.params.id }
    });

    res.json({ message: "Level deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= LESSON =================

// CREATE LESSON
app.post("/lessons", async (req, res) => {
  try {
    if (!req.body.title || !req.body.level_id) {
      return res.status(400).json({
        error: "Title and level_id required"
      });
    }

    const lesson = await Lesson.create({
      title: req.body.title,
      video_url: req.body.video_url,
      pdf_url: req.body.pdf_url,
      level_id: req.body.level_id
    });

    res.json(lesson);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET LESSONS BY LEVEL
app.get("/levels/:id/lessons", async (req, res) => {
  try {
    const lessons = await Lesson.findAll({
      where: { level_id: req.params.id }
    });

    res.json(lessons);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE LESSON
app.delete("/lessons/:id", async (req, res) => {
  try {
    await Lesson.destroy({
      where: { id: req.params.id }
    });

    res.json({ message: "Lesson deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= PROGRESS =================

app.post("/progress", async (req, res) => {
  try {
    if (!req.body.user_id || !req.body.lesson_id) {
      return res.status(400).json({
        error: "user_id and lesson_id required"
      });
    }

    const progress = await Progress.create({
      user_id: req.body.user_id,
      lesson_id: req.body.lesson_id,
      completed: true
    });

    res.json(progress);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= QUIZ =================

// CREATE QUIZ
app.post("/quiz", async (req, res) => {
  try {
    if (!req.body.title || !req.body.level_id) {
      return res.status(400).json({
        error: "Title and level_id required"
      });
    }

    const quiz = await Quiz.create({
      title: req.body.title,
      file_url: req.body.file_url,
      level_id: req.body.level_id
    });

    res.json(quiz);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET QUIZ BY LEVEL
app.get("/quiz/:level_id", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      where: { level_id: req.params.level_id }
    });

    res.json(quiz || { message: "No quiz found" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= EXAM =================

app.post("/exam/submit", async (req, res) => {
  try {
    const { user_id, quiz_id, score } = req.body;

    // ✅ Validation
    if (!user_id || !quiz_id || score == null) {
      return res.status(400).json({
        error: "user_id, quiz_id and score required"
      });
    }

    const existing = await Result.findOne({
      where: { user_id, quiz_id }
    });

    if (existing) {
      return res.json({ message: "Already submitted" });
    }

    const percentage = score;
    const passed = percentage >= 50;

    await Result.create({
      user_id,
      quiz_id,
      score,
      total: 100,
      percentage,
      passed
    });

    res.json({
      message: "Result saved",
      percentage,
      passed
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= START SERVER =================

app.listen(3000, async () => {
  await sequelize.sync({ alter: true });
  console.log(" Server running on http://localhost:3000");
});
async function seedLevels() {
    try {
        const defaultLevels = [
            "Family and Friends 1 Class Book 2nd full (lev1)",
            "Family and Friends 1 Class Book 2nd full (lev2)",
            "Family and Friends 1 Class Book 2nd full (lev3)"
        ];
        
        for (const title of defaultLevels) {
            // Check if level already exists
            const existing = await Level.findOne({ where: { title } });
            
            if (!existing) {
                // Create new level if not found
                await Level.create({ title });
                console.log("Created level:", title);
            }
        }
        console.log("Levels seeding completed");
    } catch (error) {
        console.log("Error seeding levels:", error);
    }
}

seedLevels();
