const m_admin = require('../models/m_admin');
const c_log = require('./c_log');

module.exports = async (doktorid, ucret) => {
    try {
        const doktor = await m_admin.findById(doktorid);
        if (!doktor) {
            console.log('Doktor bulunamadı.');
            return;
        }

        const bugun = new Date();
        const ay = bugun.toLocaleString('tr-TR', { month: 'long', year: 'numeric' });

        let mevcutKazanc = doktor.aylik_kazanc.find(k => k.ay == ay);


        if (mevcutKazanc) {
            parseInt(mevcutKazanc.kazanc) += ucret;
        } else {
            doktor.aylik_kazanc.push({
                ay: ay,
                kazanc: ucret
            });
        }
        await doktor.save();
    } catch (error) {
        c_log("KAZANC EKLE", error);
    }

}