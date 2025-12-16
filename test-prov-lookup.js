const API_URL = 'https://orapiweb.pttor.com/oilservice/OilPrice.asmx';

async function check(lang, province) {
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
            method: 'POST', // Only POST allowed usually
            headers: { 'Content-Type': 'application/soap+xml; charset=utf-8' },
            body: body
        });
        const text = await response.text();
        const success = text.includes('<FUEL_PROVINCIAL>') || text.includes('<FUEL>');
        console.log(`Lang: ${lang}, Prov: ${province} -> ${success ? 'SUCCESS' : 'FAIL'}`);
        if (success) {
            // Log a snippet to see if content is EN or TH
            const snippet = text.match(/<PRODUCT>(.*?)<\/PRODUCT>/);
            console.log(`   Sample Product: ${snippet ? snippet[1] : 'N/A'}`);
        }
    } catch (e) {
        console.log(`Lang: ${lang}, Prov: ${province} -> ERROR: ${e.message}`);
    }
}

async function run() {
    await check('en', 'Bangkok');
    await check('th', 'Bangkok');
    await check('en', 'กรุงเทพมหานคร'); // Standard Thai
    await check('th', 'กรุงเทพมหานคร');
    await check('en', 'Chon Buri');
    await check('th', 'ชลบุรี');
}

run();
