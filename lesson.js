const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Lesson = sequelize.define("Lesson", {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  video_url: {
    type: DataTypes.STRING
  },
  pdf_url: {
    type: DataTypes.STRING
  },
  level_id: {
    type: DataTypes.INTEGER
  }
});

module.exports = Lesson;