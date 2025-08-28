module.exports = (tarihMetni) => {
    const tarih = new Date(tarihMetni);

    const gun = String(tarih.getDate()).padStart(2, '0');
    const ay = String(tarih.getMonth() + 1).padStart(2, '0');
    const yil = tarih.getFullYear();

    const saat = String(tarih.getHours()).padStart(2, '0');
    const dakika = String(tarih.getMinutes()).padStart(2, '0');
    
    return `${gun}.${ay}.${yil} ${saat}:${dakika}`;
}