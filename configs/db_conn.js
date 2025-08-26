const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const online = process.env.DB_CONNECTION_STRING_ONLINE;
const local = process.env.DB_CONNECTION_STRING_LOCAL;
const env = process.env.ENVIRONMENT;
const connectionString = env == "local" ? local : online;


module.exports = () => {
    mongoose.connect(connectionString);
    mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB");
    });

    mongoose.connection.on("error", (err) => {
        console.log("Error MongoDB: " + err);
    });
}