const API_URL = 'https://orapiweb.pttor.com/oilservice/OilPrice.asmx';

async function check(desc, lang, province) {
    const body = `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <CurrentOilPriceProvincial xmlns="http://www.pttor.com">
      <Language>${lang}</Language>
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
        const success = text.includes('<FUEL_PROVINCIAL>') || text.includes('<FUEL>');
        console.log(`[${desc}] Lang=${lang}, Prov=${province} -> ${success ? 'SUCCESS' : 'FAIL'} (Len: ${text.length})`);
    } catch (e) {
        console.log(`[${desc}] Error: ${e.message}`);
    }
}

async function run() {
    await check('Control', 'en', 'Chonburi'); // Known GOOD
    await check('Target', 'th', 'Chonburi'); // User Desire
    await check('ThaiName', 'th', 'ชลบุรี'); // Logical Fallback
}

run();
