const API_URL = 'https://orapiweb.pttor.com/oilservice/OilPrice.asmx';

async function run() {
    const body = `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <CurrentOilPriceProvincial xmlns="http://www.pttor.com">
      <Language>en</Language>
      <Province>Chonburi</Province>
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
        console.log("Response Length:", text.length);
        console.log("Snippet:", text.substring(0, 2000));

        // Try to verify if it contains other provinces
        if (text.includes("Rayong")) console.log("Contains Rayong");
        if (text.includes("Bangkok")) console.log("Contains Bangkok");
    } catch (e) {
        console.log("Error:", e.message);
    }
}

run();
