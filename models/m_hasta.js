const mongoose = require('mongoose');

const hasta = new mongoose.Schema({
    doktor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doktorlar'
    },
    adsoyad: {
        type: String,
        required: true
    },
    tel: {
        type: String,
        required: true
    },
    randevu_tarih: {
        type: Date,
        required: true
    },
    islem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Islem'
    },
    not: String,
    ucret: {
        type: Number,
        required: true
    },
    odenen_ucret: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Hastalar', hasta);