const mongoose = require('mongoose');

const islem = new mongoose.Schema({
    ad: {
        type: String,
        required: true
    },
    ucret: {
        type: Number,
        required: true
    },
    hatirlatici: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Islem', islem);