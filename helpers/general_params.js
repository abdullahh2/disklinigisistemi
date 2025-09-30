const conf = require('dotenv').config();

module.exports = (title, req) => {
    return {
        title,
        name: req.payload.name ?? "",
        favicon: process.env.FAVICON,
        logo: process.env.LOGO,
        user: req.payload.userid
    };
}