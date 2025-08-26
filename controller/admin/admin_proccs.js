const c_log = require('../../helpers/c_log');
const m_admin = require('../../models/m_admin');
const jwt = require('jsonwebtoken');
const { WRXcrypt, WRXdecrypt } = require('../../helpers/wrx_crypt');

class AdminProccs {

    postAdmin(req, res) {
        try {
            
        } catch (error) {
            
        }
    }

    async login(req, res) {
        try {
            const user = await m_admin.findOne({ phone: req.body.phone })
            if (!user || !WRXdecrypt(req.body.password, user.password)) {
                return res.render('pages/admin/auth/login', { err: 'Kullanıcı adı veya şifre yanlış' });
            } 

            const token = jwt.sign({
                name: user.name,
                userid: user._id
            }, process.env.SECRET_KEY);
            res.cookie('token', token);
            
            return res.render('pages/admin/index', { title: 'Admin', name: user.name });
            
        } catch (error) {
            c_log("ADMIN LOGIN", error);
            return res.redirect('/Admin/Login');
        }
    }

    async doktorEkle(req, res) {
        try {
            const addAdmin = new m_admin({
                phone: req.body.phone,
                password: WRXcrypt(req.body.password),
                name: req.body.name
            });
            await addAdmin.save();
            return res.redirect('/Admin/Doktor');
        } catch (error) {
            c_log("FIRST SETTINGS", error);
        }
    }

}

module.exports = new AdminProccs();