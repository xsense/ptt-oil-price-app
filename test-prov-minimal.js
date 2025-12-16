
const PROVINCES = [
    "Bangkok", "Krabi", "Chonburi", "Chon Buri", "Rayong", "Phuket", "Chiang Mai"
];

const API_URL = 'https://orapiweb.pttor.com/oilservice/OilPrice.asmx';

async function checkProvince(province) {
    // Minimalist Body based on success pattern
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
        if (text.includes('<FUEL_PROVINCIAL>') || text.includes('<FUEL>')) {
            return { province, valid: true };
        }
        return { province, valid: false, preview: text.substring(0, 100) };
    } catch (e) {
        return { province, valid: false, error: e.message };
    }
}

async function run() {
    console.log("Validating with proven pattern...");
    for (const p of PROVINCES) {
        const res = await checkProvince(p);
        console.log(`${p}: ${res.valid ? 'OK' : 'FAIL'}`);
        await new Promise(r => setTimeout(r, 200));
    }
}

run();
