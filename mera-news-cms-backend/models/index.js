const { Sequelize } = require("sequelize");
require('dotenv').config();

const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql'
});


try {
    sequelize.authenticate();
    console.log("Database Connected Successfully!");
} catch (error) {
    console.log("Error occured while connecting to the database.", error);
}

module.exports = sequelize;