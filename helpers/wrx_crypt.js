const bcrypt = require('bcryptjs');
const conf = require('dotenv').config();

const salt = process.env.SECRET_KEY;
const WRXcrypt = (parola) => {
    return bcrypt.hashSync(`${salt}${parola}`, 10)
}
const WRXdecrypt = (parola, hash) => {
    return bcrypt.compareSync(`${salt}${parola}`, hash);
}

module.exports = { WRXcrypt, WRXdecrypt }