const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "english_learning_platform",   
  "root",             
  "password",   
  {
    host: "localhost",
    dialect: "mysql"
  }
);

module.exports = sequelize;
