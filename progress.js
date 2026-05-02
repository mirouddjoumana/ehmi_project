const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Progress = sequelize.define("Progress", {
  user_id: {
    type: DataTypes.INTEGER
  },
  lesson_id: {
    type: DataTypes.INTEGER
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Progress;