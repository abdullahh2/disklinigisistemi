const mongoose = require('mongoose');

const hasta = new mongoose.Schema({
    doktor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
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
    islem: [{
       islem: {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'islem'
       },
       adet: {
           type: Number,
           default: 1
       }
    }],
    aciklama: String,
    ucret: {
        type: Number,
        required: true
    },
    odenen_ucret: {
        type: Number,
        required: true
    },
    hatirlaticitarih: Date,
      
    
});

module.exports = mongoose.model('Hastalar', hasta);