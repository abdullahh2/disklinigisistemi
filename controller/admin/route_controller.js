const c_log = require('../../helpers/c_log');
const g_json = require('../../helpers/general_params');
const tumDoktorlarinAylikKazanciniGetir = require('../../helpers/kazanc_hesapla');

const m_admin = require('../../models/m_admin');
const m_hasta = require('../../models/m_hasta');
const m_islem = require('../../models/m_islem');
class AdminRoute {
   
async index(req, res) {
    try {
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const threeDaysLater = new Date();
        threeDaysLater.setDate(today.getDate() + 3);
        threeDaysLater.setHours(23, 59, 59, 999);
        
        const aylikKazancVerisi = await tumDoktorlarinAylikKazanciniGetir();

        
        const yaklasanlar = await m_hasta
            .find({
                randevu_tarih: {
                    $gte: today,
                    $lte: threeDaysLater
                }
            })
            .populate('doktor')
            .populate({ path: 'islem.islem', model: 'islem' })
            .sort({ randevu_tarih: 1 });

        const hatirlatilacak_hastalar = await m_hasta.find({  hatirlaticitarih: { $ne: null,  }  })
            .populate('doktor')
            .populate({ path: 'islem.islem', model: 'islem' }).sort({ hatirlaticitarih: 1 });

        return res.render('pages/admin/index', { 
            ...g_json("Admin", req),
            yaklasanlar,
            aylikKazancVerisi,
            hatirlatilacak_hastalar
        });

    } catch (error) {
        c_log("ADMIN INDEX", error);
        return res.redirect('/Admin');
    }
}
    //HASTALAR
    async hastalar(req, res) {
        try {
            
            // İki veriyi aynı anda, paralel olarak çekiyoruz
            const [hastalar, doktorlar] = await Promise.all([
                m_hasta.find().populate('doktor').populate({ path: 'islem.islem', model: 'islem' }).sort({ randevu_tarih: -1 }),
                m_admin.find().select('name').lean() // .lean() daha hızlıdır
            ]);
            
            return res.render('pages/admin/hasta/index', { 
                ...g_json("Hastalar", req), 
                hastalar, 
                doktorlar // Doktor listesini view'e gönderiyoruz
            });
        } catch (error) {
            c_log("ADMIN HASTALAR", error);
            return res.redirect('/Admin');
        }
    }

    async hastaEkle(req, res) {
        try {
            const islemler = await m_islem.find();
            const doktorlar = await m_admin.find();
            res.render('pages/admin/hasta/hasta_ekle', { ...g_json("Hasta Ekle", req), doktorlar: doktorlar, islemler: islemler });
        } catch (error) {
            c_log("ADMIN HASTA EKLE", error);
            return res.redirect('/Admin');
        }
    }
    //DOKTOR
    async doktor(req, res) {

        try {
            
            const doktorlar = await m_admin.find();
            res.render('pages/admin/doktor/index', { ...g_json("Doktorlar", req), doktorlar: doktorlar});
        } catch (error) {
            c_log("ADMIN DOKTOR", error);
            return res.redirect('/Admin/Login');
        }
        
    }

    doktorEkle(req, res) {
        
        res.render('pages/admin/doktor/doktor_ekle', { ...g_json("Doktor Ekle", req) });
    }

    //İŞLEMLER
    async islem(req, res) {
        try {
            
            const islemler = await m_islem.find();
            res.render('pages/admin/islemler/index', { ...g_json("İşlemler", req), islemler: islemler });
        } catch (error) {
            c_log("ADMIN ISLEMLER", error);
            return res.redirect('/Admin');
        }
    }

    islemEkle(req, res) {
     
        res.render('pages/admin/islemler/islem_ekle', { ...g_json("İşlem Ekle", req) });
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