
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
    "Uthai Thani", "Ubon Ratchathani"
];

const API_URL = 'https://orapiweb.pttor.com/oilservice/OilPrice.asmx';

async function checkProvince(province, displayProvince) {
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
        // Check for escaped XML tag which is what PTT returns
        if (text.includes('&lt;FUEL_PROVINCIAL&gt;') || text.includes('&lt;FUEL&gt;')) {
            return { province: displayProvince, sent: province, valid: true };
        }
        return { province: displayProvince, sent: province, valid: false };
    } catch (e) {
        return { province: displayProvince, sent: province, valid: false, error: e.message };
    }
}

async function run() {
    console.log("Validating provinces (Correct XML Check)...");

    const candidates = [];
    for (const p of PROVINCES) {
        // 1. Try Original
        candidates.push({ display: p, send: p });

        // 2. Try No Space
        if (p.includes(' ')) {
            candidates.push({ display: p, send: p.replace(/ /g, '') });
        }

        // 3. Special Manual overrides
        if (p === 'Bangkok') candidates.push({ display: 'Bangkok', send: 'Bangkok Metropolis' });
        // Add more heuristics if needed
    }

    const results = [];
    const BATCH_SIZE = 10;
    for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
        const batch = candidates.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(batch.map(c => checkProvince(c.send, c.display)));
        results.push(...batchResults);
        process.stdout.write(`.`);
    }
    console.log("\nDone.");

    // Filter to find the best functioning name for each province
    const validMap = {};
    results.forEach(r => {
        if (r.valid) {
            // Prefer original if valid, else take alternative
            if (!validMap[r.province] || (r.province === r.sent)) {
                validMap[r.province] = r.sent;
            }
        }
    });

    console.log(JSON.stringify(validMap, null, 2));
}

run();
