
const PROVINCES = [
    "Bangkok", "Krabi", "Kanchanaburi", "Kalasin", "Kamphaeng Phet", "Khon Kaen",
    "Chanthaburi", "Chachoengsao", "Chon Buri", "Chainat", "Chaiyaphum", "Chumphon",
    "Chiang Rai", "Chiang Mai", "Trang", "Trat", "Tak", "Nakhon Nayok",
    "Nakhon Pathom", "Nakhon Phanom", "Nakhon Ratchasima", "Nakhon Si Thammarat",
    "Nakhon Sawan", "Nonthaburi", "Narathiwat", "Nan", "Bueng Kan", "Buriram",
    "Pathum Thani", "Prachuap Khiri Khan", "Prachinburi", "Pattani", "Phra Nakhon Si Ayutthaya",
    "Phayeo", "Phang Nga", "Phatthalung", "Phichit", "Phitsanulok", "Phetchaburi",
    "Phetchabun", "Phrae", "Phuket", "Maha Sarakham", "Mukdahan", "Mae Hong Son",
    "Yasothon", "Yala", "Roi Et", "Ranong", "Rayong", "Ratchaburi", "Lop Buri",
    "Lampang", "Lamphun", "Loei", "Sisaket", "Sakon Nakhon", "Songkhla", "Satun",
    "Samut Prakan", "Samut Songkhram", "Samut Sakhon", "Sa Kaeo", "Saraburi",
    "Sing Buri", "Sukhothai", "Suphan Buri", "Surat Thani", "Surin", "Nong Khai",
    "Nong Bua Lam Phu", "Ang Thong", "Amnat Charoen", "Udon Thani", "Uttaradit",
    "Uthai Thani", "Ubon Ratchathani",
    // Common alternative spellings
    "Chonburi", "Lopburi", "Saraburi", "Singburi", "Suphanburi", "Prachin Buri"
];

const API_URL = 'https://orapiweb.pttor.com/oilservice/OilPrice.asmx';

async function checkProvince(province) {
    // Request THAI language but send ENGLISH province name
    const body = `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <CurrentOilPriceProvincial xmlns="http://www.pttor.com">
      <Language>th</Language>
      <Province>${province}</Province>
    </CurrentOilPriceProvincial>
  </soap12:Body>
</soap12:Envelope>`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/soap+xml; charset=utf-8' },
            body: body
        });
        const text = await response.text();
        // Check for valid return data
        if (text.includes('<FUEL_PROVINCIAL>') || text.includes('<FUEL>')) {
            return { province, valid: true };
        }
        return { province, valid: false };
    } catch (e) {
        return { province, valid: false, error: e.message };
    }
}

async function run() {
    console.log("Validating provinces (English input for Thai output)...");
    const results = [];
    for (const p of PROVINCES) {
        const res = await checkProvince(p);
        console.log(`${p}: ${res.valid ? 'OK' : 'FAIL'}`);
        results.push(res);
        await new Promise(r => setTimeout(r, 50));
    }
    console.log(JSON.stringify(results, null, 2));
}

run();
