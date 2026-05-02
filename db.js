const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "english_learning_platform",   
  "root",             
  "djoumana2006",   
  {
    host: "localhost",
    dialect: "mysql"
  }
);

module.exports = sequelize;