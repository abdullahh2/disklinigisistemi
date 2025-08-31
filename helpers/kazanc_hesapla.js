const c_log = require("./c_log");
const m_admin = require("../models/m_admin");

module.exports = async () => {
    try {
        const doktorlar = await m_admin.find().select('name aylik_kazanc');
        const datasets = [];

        const aylar = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

        doktorlar.forEach(doktor => {
            const doktorKazancVerisi = [];
            
            aylar.forEach(ay => {
                const ayinKisaAdi = ay.substring(0, 3);
                const kazancNesnesi = doktor.aylik_kazanc.find(k => k.ay.includes(ayinKisaAdi));
                doktorKazancVerisi.push(kazancNesnesi ? kazancNesnesi.kazanc : 0);
            });
            datasets.push({
                label: doktor.name,
                data: doktorKazancVerisi,
                backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
                borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
                borderWidth: 0,
                borderRadius: 50
            });
        });

        return { labels: aylar, datasets: datasets };

    } catch (error) {
        c_log("KAZANC HESAPLA", error);
        return { labels: [], datasets: [] };
    }

}