const c_log = require('../../helpers/c_log');
const m_admin = require('../../models/m_admin');
const m_islem = require('../../models/m_islem');
const m_hasta = require('../../models/m_hasta');
const jwt = require('jsonwebtoken');
const { WRXcrypt, WRXdecrypt } = require('../../helpers/wrx_crypt');
//const kazanc_ekle = require('../../helpers/kazanc_ekle');

class AdminProccs {

    async login(req, res) {
        try {
            const user = await m_admin.findOne({ phone: req.body.phone })
            if (!user || !WRXdecrypt(req.body.password, user.password)) {
                return res.render('pages/admin/auth/login', { err: 'Kullanıcı adı veya şifre yanlış' });
            } 

            const token = jwt.sign({
                name: user.name,
                phone: user.phone,
                userid: user._id
            }, process.env.SECRET_KEY);
            res.cookie('token', token);
            
            res.render('pages/admin/index', { title: 'Admin', name: user.name });
            return res.redirect('/Admin');
            
        } catch (error) {
            c_log("ADMIN LOGIN", error);
            return res.redirect('/Admin/Login');
        }
    }

    async doktorEkle(req, res) {
        try {
            const addAdmin = new m_admin({
                phone: req.body.phone,
                password: WRXcrypt(req.body.password),
                name: req.body.name
            });
            await addAdmin.save();
            return res.redirect('/Admin/Doktor');
        } catch (error) {
            c_log("Doktor Ekle Admin", error);
        }
    }

    async doktorSil(req, res) {
        try {
            if(req.body.doktorid == req.payload.userid)
                return res.redirect('/Admin/Doktor');
            await m_admin.findByIdAndDelete(req.body.doktorid);
            return res.redirect('/Admin/Doktor');
        } catch (error) {
            c_log("DOKTOR SIL ADMIN", error);
        }
    }

    async doktorGuncelle(req, res) {
        try {
            const { doktorid, name, phone, password } = req.body;
            if(password == "" && name != "" && phone != "")
                await m_admin.findByIdAndUpdate(doktorid, { name, phone });
            else if(password != "" && name != "" && phone != "")
                await m_admin.findByIdAndUpdate(doktorid, { name, phone, password: WRXcrypt(password) });
            

            return res.redirect('/Admin/Doktor');
        } catch (error) {
            c_log("DOKTOR GUNCELLE ADMIN", error);
        }
    }

    async islemEkle(req, res) {
        try {
            const islem = new m_islem({
                ad: req.body.ad,
                ucret: req.body.ucret,
                hatirlatici: req.body.hatirlatici
            });
            await islem.save();
            return res.redirect('/Admin/Islem');
        } catch (error) {
            c_log("ISLEM EKLE ADMIN", error);
        }
    }

    async islemSil(req, res) {
        try {
            await m_islem.findByIdAndDelete(req.body.islemid);
            return res.redirect('/Admin/Islem');
        } catch (error) {
            c_log("ISLEM SIL ADMIN", error);
        }
    }

    async islemDetayGetir(req, res) {
        try {
            const islem = await m_islem.findById(req.params.id);
            res.json(islem);
        } catch (error) {
            c_log("ISLEM DETAY GETIR ADMIN", error);
            res.status(500).send("Sunucu hatası");
        }
    }

    async islemGuncelle(req, res) {
        try {
            const { islemid, ad, ucret, hatirlatici } = req.body;
            await m_islem.findByIdAndUpdate(islemid, { ad, ucret, hatirlatici });
            return res.redirect('/Admin/Islem');
        } catch (error) {
            c_log("ISLEM GUNCELLE ADMIN", error);
            return res.redirect('/Admin/Islem');
        }
    }

    async hastaSil(req, res) {
        try {
            const hasta = await m_hasta.findById(req.body.hastaid);
            if (!hasta) {
                
                return res.redirect('/Admin/Hastalar');
            }
            
            await this.doktorKazancGuncelle(hasta.doktor, -hasta.odenen_ucret, hasta.randevu_tarih);
            
            await m_hasta.findByIdAndDelete(req.body.hastaid);
            
            
            return res.redirect('/Admin/Hastalar');

        } catch (error) {
            c_log("HASTA SIL ADMIN", error);
            
            return res.redirect('/Admin/Hastalar');
        }
    }


    /**
     * @param {string} doktorId - Güncellenecek doktorun ID'si
     * @param {number} ucret - Eklenecek veya çıkarılacak ücret
     * @param {Date} tarih - İşlemin yapıldığı tarih (ayı belirlemek için)
     */
    async doktorKazancGuncelle(doktorId, ucret, tarih) {
        
        const ay = tarih.toLocaleString('tr-TR', { month: 'long', year: 'numeric' });

        
        const updateResult = await m_admin.updateOne(
            { _id: doktorId, 'aylik_kazanc.ay': ay },
            { $inc: { 'aylik_kazanc.$.kazanc': ucret } }
        );

        
        if (updateResult.modifiedCount === 0) {
            await m_admin.updateOne(
                { _id: doktorId },
                { $push: { aylik_kazanc: { ay: ay, kazanc: ucret } } }
            );
        }
    }


    async hastaEkle(req, res) {
        
        try {
            const {
                adsoyad, islem: islemlerInput, doktor: doktorId, randevutarih,
                hatirlaticitarih, tel, aciklama, odenenucret
            } = req.body;


            if (!islemlerInput || Object.keys(islemlerInput).length === 0) {
                console.log("HATA: Formdan 'islemlerInput' verisi gelmedi veya boş.");
                console.log("İşlem durduruldu. Sayfa yenileniyor.");
                return res.redirect('/Admin/Hastalar/Ekle'); // Yönlendirme yolu kendinize göre /Hasta/Ekle olabilir
            }
            console.log("'islemlerInput' verisi kontrolü başarılı. Devam ediliyor...");

            const islemIdleri = Object.keys(islemlerInput);
            const bulunanIslemler = await m_islem.find({ '_id': { $in: islemIdleri } });

            if (bulunanIslemler.length !== islemIdleri.length) {
                console.log("HATA: Formdan gelen işlem ID'lerinden bazıları veritabanında bulunamadı.");
                console.log("İşlem durduruldu. Sayfa yenileniyor.");
                return res.redirect('/Admin/Hastalar/Ekle');
            }
            
            const islemlerMap = new Map(bulunanIslemler.map(i => [i._id.toString(), i]));
            let totalUcret = 0;
            const hastaIslemleri = [];

            for (const islemId of islemIdleri) {
                const islemDetay = islemlerMap.get(islemId);
                const adet = parseInt(islemlerInput[islemId].adet) || 1;
                totalUcret += islemDetay.ucret * adet;
                hastaIslemleri.push({ islem: islemId, adet: adet });
            }
            
            console.log("Hesaplanan Toplam Ücret:", totalUcret);

            const yeniHasta = new m_hasta({
                adsoyad,
                islem: hastaIslemleri,
                doktor: doktorId,
                randevu_tarih: randevutarih,
                tel,
                aciklama,
                ucret: totalUcret,
                odenen_ucret: odenenucret,
                ...(hatirlaticitarih && { hatirlaticitarih })
            });
            
            console.log("Veritabanına kaydedilecek yeni hasta nesnesi oluşturuldu.");
            await yeniHasta.save();
            console.log("Yeni hasta başarıyla veritabanına kaydedildi.");

            await this.doktorKazancGuncelle(doktorId, odenenucret, new Date(randevutarih));
            console.log("Doktor kazancı güncellendi.");
            
            console.log("TÜM İŞLEMLER BAŞARILI! Yönlendirme yapılıyor...");
            return res.redirect('/Admin/Hastalar');

        } catch (error) {
            // --- LOG 3: HATA YAKALAMA ---
            // Eğer try bloğu içinde herhangi bir yerde hata olursa, bu blok çalışır.
            console.error("\n--- HATA YAKALANDI ---");
            console.error("Hata Zamanı:", new Date().toLocaleTimeString());
            console.error("Hatanın tam çıktısı:", error);
            console.error("----------------------\n");
            return res.redirect('/Admin/Hastalar/Ekle');
        }
    }

    async hastaGuncelle(req, res) {
        try {
            const {
                hastaid, adsoyad, tel, randevutarih, doktor: yeniDoktorId,
                odenenucret: yeniOdenenUcret, aciklama, hatirlaticitarih
            } = req.body;
            const guncelIslemler = req.body.islemler;

            const mevcutHasta = await m_hasta.findById(hastaid).populate('islem.islem');
            if (!mevcutHasta) {
                return res.redirect('/Admin/Hastalar');
            }

            let yeniToplamUcret = 0;
            const yeniIslemListesi = [];
            
            if (guncelIslemler) {
                const islemIdleri = Object.keys(guncelIslemler);
                const islemDetaylari = await m_islem.find({ '_id': { $in: islemIdleri } });
                const islemMap = new Map(islemDetaylari.map(i => [i._id.toString(), i]));

                for (const islemId of islemIdleri) {
                    const islemDetay = islemMap.get(islemId);
                    if (islemDetay) {
                        const adet = parseInt(guncelIslemler[islemId].adet, 10);
                        if (adet > 0) {
                            yeniToplamUcret += islemDetay.ucret * adet;
                            yeniIslemListesi.push({ islem: islemId, adet: adet });
                        }
                    }
                }
            }

            const eskiDoktorId = mevcutHasta.doktor.toString();
            const eskiOdenenUcret = mevcutHasta.odenen_ucret;
            const eskiRandevuTarih = mevcutHasta.randevu_tarih;

            const doktorDegisti = eskiDoktorId !== yeniDoktorId;
            const odenenUcretDegisti = eskiOdenenUcret !== parseFloat(yeniOdenenUcret);

            if (doktorDegisti || odenenUcretDegisti) {
                await this.doktorKazancGuncelle(eskiDoktorId, -eskiOdenenUcret, new Date(eskiRandevuTarih));
                await this.doktorKazancGuncelle(yeniDoktorId, parseFloat(yeniOdenenUcret), new Date(randevutarih));
            }

            const guncellenecekVeri = {
                adsoyad,
                tel,
                randevu_tarih: randevutarih,
                doktor: yeniDoktorId,
                odenen_ucret: yeniOdenenUcret,
                aciklama,
                ...(hatirlaticitarih && { hatirlaticitarih })
            };

            // If there are any treatments, always update the price and the treatment list.
            // If guncelIslemler is empty/null, it means all treatments were removed.
            guncellenecekVeri.ucret = yeniToplamUcret;
            guncellenecekVeri.islem = yeniIslemListesi;

            await m_hasta.findByIdAndUpdate(hastaid, guncellenecekVeri);

            c_log("HASTA GÜNCELLENDİ", `Hasta ID: ${hastaid}`);
            return res.redirect('/Admin/Hastalar');

        } catch (error) {
            c_log("HASTA GÜNCELLEME HATASI", error);
            return res.redirect('/Admin/Hastalar');
        }
    }


}

module.exports = new AdminProccs();
    