const m_admin = require('../models/m_admin');
const dotenv = require('dotenv').config();
const c_log = require('../helpers/c_log');
const { WRXcrypt } = require('../helpers/wrx_crypt');

module.exports = async () => {
    let users = await m_admin.find();
    if(users.length > 0)
        return;

    try {
        const addAdmin = new m_admin({
            phone: process.env.ADMIN_PHONE,
            password: WRXcrypt(process.env.ADMIN_PASSWORD),
            name: process.env.ADMIN_NAME
        });
        await addAdmin.save();
    } catch (error) {
        c_log("FIRST SETTINGS", error);
    }
}