const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Quiz = sequelize.define("Quiz", {
  level_id: DataTypes.INTEGER,
  title: DataTypes.STRING,
  file_url: DataTypes.STRING
});

module.exports = Quiz;