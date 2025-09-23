const m_admin = require('../models/m_admin');

// Bu fonksiyonu controller dosyanızın uygun bir yerine ekleyin.
module.exports = async () => {
    try {
        const kazancVerisi = await m_admin.aggregate([
            {
                // 1. Adım: 'aylik_kazanc' dizisindeki her bir elemanı ayrı bir belge haline getir.
                // Örnek: Bir doktorun 3 aylık kazancı varsa, bu doktor için 3 ayrı belge oluşur.
                $unwind: "$aylik_kazanc"
            },
            {
                // 2. Adım: Doktorun ID'sine göre grupla ve kazançları topla.
                $group: {
                    _id: "$_id", // Her doktoru kendi ID'si ile grupla
                    name: { $first: "$name" }, // Doktorun ismini koru
                    totalKazanc: { $sum: "$aylik_kazanc.kazanc" } // Parçalanan kazançları topla
                }
            },
            {
                // 3. Adım: Çıktıyı Pug şablonunun beklediği formata getir.
                $project: {
                    _id: 0, // ID'yi gösterme
                    name: 1, // İsmi göster
                    totalKazanc: 1 // Toplam kazancı göster
                }
            },
            {
                // 4. Adım (Opsiyonel): En çok kazananı üstte göstermek için sırala.
                $sort: {
                    totalKazanc: -1
                }
            }
        ]);
        return kazancVerisi;

    } catch (error) {
        console.error("Doktor toplam kazançları getirilirken hata oluştu:", error);
        return [];
    }

}