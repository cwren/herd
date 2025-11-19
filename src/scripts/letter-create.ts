
import { validateCaptcha } from '@/scripts/recaptcha.js';
import { DriveClient } from '@/scripts/google-drive';
import { letterToPdf } from '@/scripts/letter-format.js';
import { LetterStorage } from '@/scripts/letter-store.js';
import { LogStorage } from '@/scripts/log-store.js';
import { validateEnvelope } from "@/scripts/crypto";
import { type Rep, type Letter, FlowStatus } from '@/scripts/letter-state.js';
import { type Envelope, minMessageLength, maxMessageLength } from '@/scripts/letter-state.js';
import crypto from "crypto";

import { USE_CAPTCHA } from "astro:env/server";
import { SHOW_CAPTCHA } from "astro:env/client";
const useCaptcha = SHOW_CAPTCHA && USE_CAPTCHA; // don't validate captcha unless we're showing it to the user

export async function createLetters(
    envelope: Envelope,
    message: string,
    photoData: string | null,
    captchaToken: string,
    today: string)
    : Promise<[FlowStatus, Letter[]]>
    {
    var flowStatus: FlowStatus = FlowStatus.ERROR;
    var letters: Array<Letter> = [];

    var captchaIsValid = false;
    try {
        captchaIsValid = await validateCaptcha(captchaToken);
    } catch (error) {
        console.log("letter failed due to error validating captcha:", error);
    }
    if (envelope === null) {
        console.log("letter failed due to null envelope");
    } else if (!validateEnvelope(envelope)) {
        console.log("letter failed due to invalid envelope signature ");
    } else if (useCaptcha && (captchaToken === null || captchaToken === "")) {
        console.log("letter failed due to missing captcha");
    } else if (useCaptcha && !captchaIsValid) {
        console.log("letter failed due to invalid captcha");
    } else if (message.length < minMessageLength || message.length > maxMessageLength) {
        console.log("letter failed due to invalid message length");
    } else {
        const address = envelope!.address;
        const reps = envelope!.reps;
        const now = new Date().getTime();
        if (!photoData!.startsWith("data:image/png")) {
            photoData = null;
            console.log("creating letter without photo");
        } else {
            console.log("creating letter with photo");
        }
        const drafts = reps.map((rep: Rep) => {
                const letterId = crypto.createHash('sha256')
                .update(JSON.stringify(address))
                .update(now.toString())
                .digest('hex')
                .substring(0, 8)
                .toUpperCase();
            return {
                letterId: letterId,
                filename: `${rep.salutation} - ${today} - ${address.name}.pdf`,
                data: letterToPdf(address, rep, today, letterId, message, photoData),
                address: address,
                today: today,
                message: message,
                hasPhoto: !!photoData,
                recipient: rep,
            }
        });
        try {
            const driveClient = new DriveClient();
            await driveClient.authorize()
            const logTask = new LogStorage(driveClient).recordLetters(drafts);
            const letterTask = new LetterStorage(driveClient).uploadLetters(drafts);
            const responses = await Promise.all([letterTask, logTask]);
            console.log("letters uploaded");
            flowStatus = FlowStatus.RECEIPT;
            letters = responses[0];
        } catch (error) {
            console.log("failed to upload letters:", error);
        }
    }
    return [flowStatus, letters];
}