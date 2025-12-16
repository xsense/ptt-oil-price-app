const API_URL = 'https://orapiweb.pttor.com/oilservice/OilPrice.asmx';

async function check(desc, province) {
    const body = `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <CurrentOilPriceProvincial xmlns="http://www.pttor.com">
      <Language>en</Language>
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
        console.log(`[${desc}] Prov: "${province}" -> ${success ? 'SUCCESS' : 'FAIL'} (Len: ${text.length})`);
        if (text.length < 500) console.log(text);
    } catch (e) {
        console.log(`[${desc}] ERROR: ${e.message}`);
    }
}

async function run() {
    await check('Empty', '');
    await check('Space', ' ');
    await check('Wildcard', '*');
    await check('ID_1', '1');
    await check('ID_10', '10');
    await check('BKK_Metropolis', 'Bangkok Metropolis');
    await check('Chonburi_NoSpace', 'Chonburi');
    await check('Chon_Buri', 'Chon Buri'); // This matched existing list

    // Thai attempts
    const bodyTH = (p) => `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <CurrentOilPriceProvincial xmlns="http://www.pttor.com">
      <Language>th</Language>
      <Province>${p}</Province>
    </CurrentOilPriceProvincial>
  </soap12:Body>
</soap12:Envelope>`;

    const checkTH = async (d, p) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/soap+xml; charset=utf-8' },
                body: bodyTH(p)
            });
            const text = await response.text();
            const success = text.includes('<FUEL_PROVINCIAL>') || text.includes('<FUEL>');
            console.log(`[TH_${d}] Prov: "${p}" -> ${success ? 'SUCCESS' : 'FAIL'}`);
        } catch (e) { console.log(e); }
    };

    await checkTH('BKK', 'กรุงเทพมหานคร');
    await checkTH('BKK_Short', 'กรุงเทพฯ');
    await checkTH('Chonburi', 'ชลบุรี');
}

run();
