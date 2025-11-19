import { type Envelope } from '@/scripts/letter-state.js';
import crypto from "crypto";
import { ENVELOPE_KEY } from "astro:env/server";

export function validateEnvelope (envelope: Envelope) {
    if (envelope === null || envelope.address === null || envelope.reps === null ) {
        return false;
    }
    const expectedSignature = signEnvelope(envelope);
    return crypto.timingSafeEqual(
        Buffer.from(envelope.signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
    );
}

export function signEnvelope (envelope: Envelope) : string {
    if (envelope === null || envelope.address === null || envelope.reps === null ) {
        return "invalid envelope";
    }
    const hmac = crypto.createHmac('sha256', ENVELOPE_KEY);
    hmac.update(JSON.stringify(envelope.address));
    hmac.update(JSON.stringify(envelope.reps));
    return hmac.digest('hex');
}