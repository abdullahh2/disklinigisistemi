var express = require('express');
var route = require('../../../controller/admin/route_controller');
var proccs = require('../../../controller/admin/admin_proccs');
var router = express.Router();


/* GET home page. */
router.get('/', route.index);

//HASTALAR
router.get('/Hastalar', route.hastalar);
router.get('/Hastalar/Ekle', route.hastaEkle);

// DOKTOR
router.get('/Doktor', route.doktor);
router.get('/Doktor/Ekle', route.doktorEkle);
router.post('/Doktor/Ekle', proccs.doktorEkle);
router.post('/Doktor/Sil', proccs.doktorSil);

// İŞLEMLER
router.get('/Islem', route.islem);
router.get('/Islem/Ekle', route.islemEkle);
router.post('/Islem/Ekle', proccs.islemEkle);
router.post('/Islem/Sil', proccs.islemSil);

// AUTH
router.post('/Logout', route.postLogout);


module.exports = router;
