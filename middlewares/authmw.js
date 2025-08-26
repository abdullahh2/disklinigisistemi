const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const auth = (req, res, next) => {
    let token = req.cookies.token || req.headers['x-access-token'] || req.body.token || req.query.token || req.headers['authorization'];
    const secretkey = process.env.SECRET_KEY;
    if (!token) {
        res.redirect("/Admin/Login");
        return;
    } 
        
    jwt.verify(token, secretkey, (err, payload) => {
        if (err) {
            res.redirect("/Admin/Login");
            return;
        } 
        
        req.payload = payload;
        next();
        
    });
    
}

module.exports = auth;