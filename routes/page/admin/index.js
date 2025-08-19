var express = require('express');
var route = require('../../../controller/admin/route_controller');
var router = express.Router();


/* GET home page. */
router.get('/', route.index);

//HASTALAR
router.get('/Hastalar', route.hastalar);
router.get('/Hastalar/Ekle', route.hastaEkle);

// AUTH
router.get('/Login', route.login);
router.get('/ForgotPassword', route.forgotPassword);

// DOKTOR
router.get('/Doktor', route.doktor);
router.get('/Doktor/Ekle', route.doktorEkle);

// İŞLEMLER
router.get('/Islem', route.islem);
router.get('/Islem/Ekle', route.islemEkle);

module.exports = router;
