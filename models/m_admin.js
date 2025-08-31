const mongoose = require('mongoose');

const user = new mongoose.Schema({
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    aylik_kazanc: [
        {
            ay: {
                type: String,
                required: true
            },
            kazanc: {
                type: Number,
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('admin', user);