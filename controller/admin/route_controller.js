const c_log = require('../../helpers/c_log');
const diffDate = require('../../helpers/date_diff');
const m_admin = require('../../models/m_admin');
const m_hasta = require('../../models/m_hasta');
const m_islem = require('../../models/m_islem');
class AdminRoute {
   // Kontrolcü fonksiyonunun güncellenmiş hali
async index(req, res) {
    try {
        var name = req.payload.name;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const threeDaysLater = new Date();
        threeDaysLater.setDate(today.getDate() + 3);
        threeDaysLater.setHours(23, 59, 59, 999);
        
        
        const yaklasanlar = await m_hasta
            .find({ 
                randevu_tarih: { 
                    $gte: today, 
                    $lte: threeDaysLater 
                } 
            })
            .populate('doktor')
            .populate('islem')
            .sort({ randevu_tarih: 1 });

        return res.render('pages/admin/index', { 
            title: 'Admin', 
            name: name,
            yaklasanlar: yaklasanlar
        });

    } catch (error) {
        c_log("ADMIN INDEX", error);
        return res.redirect('/Admin');
    }
}
    //HASTALAR
    async hastalar(req, res) {
        try {
            var name = req.payload.name;
            const hastalar = await m_hasta.find().populate('doktor').populate('islem').sort({ randevu_tarih: -1 });
            return res.render('pages/admin/hasta/index', { title: 'Hastalar', name: name, hastalar: hastalar });
        } catch (error) {
            c_log("ADMIN HASTALAR", error);
            return res.redirect('/Admin');
        }
    }

    async hastaEkle(req, res) {
        try {
            var name = req.payload.name;
            const islemler = await m_islem.find();
            const doktorlar = await m_admin.find();
            res.render('pages/admin/hasta/hasta_ekle', { title: 'Hasta Ekle', name: name, doktorlar: doktorlar, islemler: islemler });
        } catch (error) {
            c_log("ADMIN HASTA EKLE", error);
            return res.redirect('/Admin');
        }
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
    async islem(req, res) {
        try {
            var name = req.payload.name;
            const islemler = await m_islem.find();
            res.render('pages/admin/islemler/index', { title: 'İşlemler', name: name, islemler: islemler });
        } catch (error) {
            c_log("ADMIN ISLEMLER", error);
            return res.redirect('/Admin');
        }
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