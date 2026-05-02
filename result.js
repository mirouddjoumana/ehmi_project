const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Result = sequelize.define("Result", {
  user_id: DataTypes.INTEGER,
  quiz_id: DataTypes.INTEGER,
  score: DataTypes.INTEGER,
  total: DataTypes.INTEGER,
  percentage: DataTypes.FLOAT,
  passed: DataTypes.BOOLEAN
});

module.exports = Result;