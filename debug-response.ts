
import { getCurrentOilPrice, getProvincialOilPrice } from './src/lib/ptt-client';

async function debug() {
    console.log("Debugging Current Oil Price...");
    try {
        const current = await getCurrentOilPrice();
        console.log("Current Price Count:", current.length);
        if (current.length > 0) {
            console.log("Sample:", current[0]);
        }
    } catch (e) {
        console.error("Current Price Error:", e);
    }

    console.log("\nDebugging Provincial Oil Price (Nonthaburi)...");
    try {
        const provincial = await getProvincialOilPrice("Nonthaburi");
        console.log("Provincial Price Count:", provincial.length);
        if (provincial.length > 0) {
            console.log("Sample:", provincial[0]); // { PRODUCT: '...', PRICE: ... }
        }
    } catch (e) {
        console.error("Provincial Price Error:", e);
    }
}

debug();
