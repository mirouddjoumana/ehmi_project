const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Define the Level model
const Level = sequelize.define("Level", {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Level;