
import { XMLParser } from 'fast-xml-parser';

const API_URL = 'https://orapiweb.pttor.com/oilservice/OilPrice.asmx';

export interface OilPrice {
    PRODUCT: string;
    PRICE: number;
    LOCATION?: string;
}

export interface PttFunctionResponse {
    ResultStr: string;
}

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_"
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function fetchSoap(action: string, body: string) {
    // Using SOAP 1.2 Envelope
    const envelope = `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    ${body}
  </soap12:Body>
</soap12:Envelope>`;

    let lastError: any;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/soap+xml; charset=utf-8',
                    // SOAP 1.2 often doesn't need explicit SOAPAction header if action is in body or not required, 
                    // but if needed it's usually part of Content-Type parameter 'action' or separate. 
                    // Based on my debug, just Content-Type worked.
                },
                body: envelope,
                // cache: 'no-store' // Let Next.js handle caching via route config or defaults
            });

            if (!response.ok) {
                const errorText = await response.text();
                // 500 errors are common with this API, explicit throw to trigger retry
                throw new Error(`SOAP request failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const text = await response.text();
            const result = parser.parse(text);
            return result;

        } catch (error) {
            lastError = error;
            console.warn(`Attempt ${attempt} failed:`, error);
            if (attempt < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
            }
        }
    }

    throw lastError;
}

export async function getCurrentOilPrice(lang: 'th' | 'en' = 'th'): Promise<OilPrice[]> {
    const action = 'CurrentOilPrice';
    // Namespace UPDATE: http://www.pttor.com matches the legacy backend expectation, not https://orapiweb.pttor.com
    const body = `<CurrentOilPrice xmlns="http://www.pttor.com">
      <Language>${lang}</Language>
    </CurrentOilPrice>`;

    try {
        const soapResult = await fetchSoap(action, body);
        // SOAP 1.2 Response structure might differ slightly in keys (soap12:Envelope vs soap:Envelope)
        // fast-xml-parser preserves keys as they appear.
        const envelope = soapResult['soap12:Envelope'] || soapResult['soap:Envelope'];
        const bodyPart = envelope['soap12:Body'] || envelope['soap:Body'];
        const resultXml = bodyPart[`${action}Response`][`${action}Result`];

        const innerParser = new XMLParser();
        const innerData = innerParser.parse(resultXml);

        if (!innerData.PTTOR_DS || !innerData.PTTOR_DS.FUEL) {
            return [];
        }

        const fuels = Array.isArray(innerData.PTTOR_DS.FUEL)
            ? innerData.PTTOR_DS.FUEL
            : [innerData.PTTOR_DS.FUEL];

        return fuels.map((f: { PRODUCT: string; PRICE: string }) => ({
            PRODUCT: f.PRODUCT,
            PRICE: f.PRICE ? parseFloat(f.PRICE) : 0
        })).filter((f: OilPrice) => f.PRICE > 0);

    } catch (error) {
        console.error("Error fetching current oil price:", error);
        return [];
    }
}

export async function getOilPriceHistory(date: Date, lang: 'th' | 'en' = 'th'): Promise<OilPrice[]> {
    const action = 'GetOilPrice';
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();

    // Namespace UPDATE here too
    const body = `<GetOilPrice xmlns="http://www.pttor.com">
      <Language>${lang}</Language>
      <DD>${dd}</DD>
      <MM>${mm}</MM>
      <YYYY>${yyyy}</YYYY>
    </GetOilPrice>`;

    try {
        const soapResult = await fetchSoap(action, body);
        const envelope = soapResult['soap12:Envelope'] || soapResult['soap:Envelope'];
        const bodyPart = envelope['soap12:Body'] || envelope['soap:Body'];
        const resultXml = bodyPart[`${action}Response`][`${action}Result`];

        const innerParser = new XMLParser();
        const innerData = innerParser.parse(resultXml);

        if (!innerData.PTTOR_DS || !innerData.PTTOR_DS.FUEL) {
            return [];
        }

        const fuels = Array.isArray(innerData.PTTOR_DS.FUEL)
            ? innerData.PTTOR_DS.FUEL
            : [innerData.PTTOR_DS.FUEL];

        return fuels.map((f: { PRODUCT: string; PRICE: string }) => ({
            PRODUCT: f.PRODUCT,
            PRICE: f.PRICE ? parseFloat(f.PRICE) : 0
        }));
    } catch (error) {
        console.error("Error fetching oil price history:", error);
        return [];
    }
}

import { VALID_PROVINCES } from './provinces';

// ... (rest of the file until getProvincialOilPrice)

export async function getProvincialOilPrice(province: string, lang: 'th' | 'en' = 'th'): Promise<OilPrice[]> {
    const action = 'CurrentOilPriceProvincial';

    // Use mapped name if available, otherwise fallback to original
    // This allows UI to show "Chon Buri" but send "ChonBuri"
    const apiProvinceName = VALID_PROVINCES[province as keyof typeof VALID_PROVINCES] || province;

    const body = `<CurrentOilPriceProvincial xmlns="http://www.pttor.com">
      <Language>${lang}</Language> 
      <Province>${apiProvinceName}</Province>
    </CurrentOilPriceProvincial>`;

    try {
        const soapResult = await fetchSoap(action, body);
        const envelope = soapResult['soap12:Envelope'] || soapResult['soap:Envelope'];
        const bodyPart = envelope['soap12:Body'] || envelope['soap:Body'];
        const resultXml = bodyPart[`${action}Response`][`${action}Result`];

        const innerParser = new XMLParser();
        const innerData = innerParser.parse(resultXml);

        // Provincial data returns FUEL_PROVINCIAL, not FUEL
        const fuelKey = innerData.PTTOR_DS.FUEL ? 'FUEL' : 'FUEL_PROVINCIAL';

        if (!innerData.PTTOR_DS || !innerData.PTTOR_DS[fuelKey]) {
            return [];
        }

        const fuels = Array.isArray(innerData.PTTOR_DS[fuelKey])
            ? innerData.PTTOR_DS[fuelKey]
            : [innerData.PTTOR_DS[fuelKey]];

        return fuels.map((f: { PRODUCT: string; PRICE: string, LOCATION: string }) => ({
            PRODUCT: f.PRODUCT,
            PRICE: f.PRICE ? parseFloat(f.PRICE) : 0,
            LOCATION: f.LOCATION,
        })).filter((f: OilPrice) => f.PRICE > 0);

    } catch (error) {
        console.error(`Error fetching provincial oil price for ${province}:`, error);
        return [];
    }
}
