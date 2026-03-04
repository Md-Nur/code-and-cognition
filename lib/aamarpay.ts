const STORE_ID = process.env.AAMARPAY_STORE_ID;
const SIGNATURE_KEY = process.env.AAMARPAY_SIGNATURE_KEY;
const IS_SANDBOX = process.env.AAMARPAY_IS_SANDBOX === "true";

const BASE_URL = IS_SANDBOX
    ? "https://sandbox.aamarpay.com"
    : "https://secure.aamarpay.com";

export interface AamarPayInitiateParams {
    tran_id: string;
    amount: string;
    currency: "BDT" | "USD";
    desc: string;
    cus_name: string;
    cus_email: string;
    cus_phone: string;
    success_url: string;
    fail_url: string;
    cancel_url: string;
    opt_a?: string;
    opt_b?: string;
    opt_c?: string;
    opt_d?: string;
    cus_add1: string;
    cus_city: string;
    cus_country: string;
}

/**
 * Initiates a payment request to AamarPay.
 * Returns the payment URL if successful.
 */
export async function initiateAamarPayPayment(params: AamarPayInitiateParams) {
    if (!STORE_ID || !SIGNATURE_KEY) {
        throw new Error("AamarPay credentials are not configured.");
    }

    const payload = {
        store_id: STORE_ID,
        signature_key: SIGNATURE_KEY,
        type: "json",
        ...params,
    };

    const response = await fetch(`${BASE_URL}/jsonpost.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("AamarPay Initiation Error:", errorText);
        throw new Error(`AamarPay initiation failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.result !== "true") {
        console.error("AamarPay Initiation Result Error:", JSON.stringify(data, null, 2));
        // AamarPay sometimes returns the error in 'error' or 'response' field
        const errorMessage = data.error || data.response || "AamarPay initiation failed";
        throw new Error(errorMessage);
    }

    return data; // contains payment_url
}

/**
 * Verifies a transaction status with AamarPay.
 */
export async function verifyAamarPayPayment(tran_id: string) {
    if (!STORE_ID || !SIGNATURE_KEY) {
        throw new Error("AamarPay credentials are not configured.");
    }

    const url = `${BASE_URL}/api/v1/trxcheck/request.php?request_id=${tran_id}&store_id=${STORE_ID}&signature_key=${SIGNATURE_KEY}&type=json`;

    const response = await fetch(url, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error(`AamarPay verification failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}
