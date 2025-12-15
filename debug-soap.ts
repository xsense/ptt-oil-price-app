
const API_URL = 'https://orapiweb.pttor.com/oilservice/OilPrice.asmx';

async function testVariant(name: string, headers: any, body: string) {
    console.log(`\n--- Testing ${name} ---`);
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: headers,
            body: body,
            cache: 'no-store'
        });

        const text = await response.text();
        console.log(`Status: ${response.status}`);
        if (response.ok) {
            console.log("SUCCESS! Response start:", text.substring(0, 300));
        } else {
            console.log("FAILED. Response start:", text.substring(0, 300));
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

async function runTests() {
    // Test 1: SOAP 1.1 with Doc Namespace + 'th'
    const bodyDocTh = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <CurrentOilPrice xmlns="http://www.pttor.com">
      <Language>th</Language>
    </CurrentOilPrice>
  </soap:Body>
</soap:Envelope>`;

    await testVariant("SOAP 1.1 Doc Namespace + th", {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': '"https://orapiweb.pttor.com/CurrentOilPrice"'
    }, bodyDocTh);

    // Test 2: SOAP 1.2 with Doc Namespace + 'en'
    const body12Doc = `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <CurrentOilPrice xmlns="http://www.pttor.com">
      <Language>en</Language>
    </CurrentOilPrice>
  </soap12:Body>
</soap12:Envelope>`;

    await testVariant("SOAP 1.2 Doc Namespace", {
        'Content-Type': 'application/soap+xml; charset=utf-8'
    }, body12Doc);
}

runTests();
