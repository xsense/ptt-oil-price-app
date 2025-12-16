const API_URL = 'https://orapiweb.pttor.com/oilservice/OilPrice.asmx';

async function check(desc, namespace, lang, province) {
    const body = `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <CurrentOilPriceProvincial xmlns="${namespace}">
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
        console.log(`[${desc}] NS: ${namespace}, Lang: ${lang}, Prov: ${province} -> ${success ? 'SUCCESS' : 'FAIL'}`);
    } catch (e) {
        console.log(`[${desc}] ERROR: ${e.message}`);
    }
}

async function run() {
    const nsLegacy = 'http://www.pttor.com';
    const nsWsdl = 'https://orapiweb.pttor.com';

    await check('Legacy+TH', nsLegacy, 'th', 'กรุงเทพมหานคร');
    await check('WSDL+TH', nsWsdl, 'th', 'กรุงเทพมหานคร');

    await check('Legacy+EN', nsLegacy, 'en', 'Bangkok');
    await check('WSDL+EN', nsWsdl, 'en', 'Bangkok');

    // Try partial/alternative names
    await check('Legacy+TH_Short', nsLegacy, 'th', 'กรุงเทพฯ');
}

run();
