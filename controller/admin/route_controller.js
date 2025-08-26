const c_log = require('../../helpers/c_log');
const m_admin = require('../../models/m_admin');
class AdminRoute {
    index(req, res) {
        var name = req.payload.name;
        res.render('pages/admin/index', { title: 'Admin', name: name });
    }
    //HASTALAR
    hastalar(req, res) {
        var name = req.payload.name;
        res.render('pages/admin/hasta/index', { title: 'Hastalar', name: name });
    }

    hastaEkle(req, res) {
        var name = req.payload.name;
        res.render('pages/admin/hasta/hasta_ekle', { title: 'Hasta Ekle', name: name });
    }
    //DOKTOR
    async doktor(req, res) {

        try {
        var name = req.payload.name;

            const doktorlar = await m_admin.find();
            res.render('pages/admin/doktor/index', { title: 'Doktorlar', doktorlar: doktorlar, name: name });
        } catch (error) {
            c_log("ADMIN DOKTOR", error);
            return res.redirect('/Admin/Login');
        }
        
    }

    doktorEkle(req, res) {
        var name = req.payload.name;

        res.render('pages/admin/doktor/doktor_ekle', { title: 'Doktor Ekle', name: name });
    }

    //İŞLEMLER
    islem(req, res) {
        var name = req.payload.name;

        res.render('pages/admin/islemler/index', { title: 'İşlemler', name: name });
    }

    islemEkle(req, res) {
        var name = req.payload.name;

        res.render('pages/admin/islemler/islem_ekle', { title: 'İşlem Ekle', name: name });
    }


    //

    //AUTH
    login(req, res) {
        res.render('pages/admin/auth/login', { err: null });
    }

    forgotPassword(req, res) {
      res.render('pages/admin/auth/forgot_pass');
    }

    async postLogout(req, res) {
        try {
            res.clearCookie('token');
            return res.redirect('/Admin/Login');
        } catch (error) {
            c_log("ADMIN LOGOUT", error);
            return res.redirect('/Admin/Login');
        }
    }


}

module.exports = new AdminRoute();