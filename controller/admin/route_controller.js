class AdminRoute {
    index(req, res) {
        res.render('pages/admin/index', { title: 'Admin' });
    }
    //HASTALAR
    hastalar(req, res) {
        res.render('pages/admin/hasta/index', { title: 'Hastalar' });
    }

    hastaEkle(req, res) {
      res.render('pages/admin/hasta/hasta_ekle', { title: 'Hasta Ekle' });
    }
    //DOKTOR
    doktor(req, res) {
        res.render('pages/admin/doktor/index', {title: "Doktor Listesi"});
    }

    doktorEkle(req, res) {
        res.render('pages/admin/doktor/doktor_ekle', { title: 'Doktor Ekle' });
    }

    //İŞLEMLER
    islem(req, res) {
        res.render('pages/admin/islemler/index', { title: 'İşlemler' });
    }

    islemEkle(req, res) {
        res.render('pages/admin/islemler/islem_ekle', { title: 'İşlem Ekle' });
    }


    //

    //AUTH
    login(req, res) {
        res.render('pages/admin/auth/login');
    }

    forgotPassword(req, res) {
      res.render('pages/admin/auth/forgot_pass');
    }


}

module.exports = new AdminRoute();