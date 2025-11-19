"use client"

import { RECAPTCHA_SITE_KEY, SHOW_CAPTCHA } from "astro:env/client";

import { Button } from "@/components/ui/button"
import { type Envelope, type Rep, minMessageLength, maxMessageLength } from '@/scripts/letter-state.js';
import profileRef from '../../assets/profile.png';
import ReCAPTCHA from "react-google-recaptcha";
import TextareaAutosize from 'react-textarea-autosize';


import React, { useRef, useState } from "react";

const today = new Date().toLocaleString('default', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});
const redMessageLength = 0.9 * maxMessageLength;
const yellowMessageLength = 0.75 * maxMessageLength;

const messagePlaceholder = "On this occasion, I write to you on a topic of grave importance.";

type Props = {
    envelope: Envelope,
};

export default function Draft(props: Props) {
    const envelope = props.envelope;
    const address = envelope!.address;
    const reps = envelope!.reps;

    const headshot = useRef<HTMLImageElement>(null);
    const uploadInput = useRef<HTMLInputElement>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [headshotData, setHeadshotData] = useState("");
    const [headshotSource, setheadshotSource] = useState(profileRef.src);
    const [captchaData, setCaptchaData] = useState<string | null>(SHOW_CAPTCHA ? null : "DISABLED");
    const [messageContent, setInputValue] = useState('');
    const [messageLength, setMessageLength] = useState(0);
    
    function handleMessageChange(event: { target: { value: any; }; }) {
        const text = event.target.value;
        setInputValue(text);
        setMessageLength(text.length);
    };

    function handleSubmit() {
        setIsSubmitting(true);
    }

    function initiateUpload() {
        if (uploadInput.current) {
            uploadInput.current.click();
        }
    }

    function scaleHeadshot() {
        if (headshot.current) {
            // resize into a canvas incase it is large
            const canvas = new OffscreenCanvas(headshot.current.clientWidth * 2, headshot.current.clientHeight * 2);
            const context = canvas.getContext('2d');
            context?.drawImage(headshot.current, 0, 0, canvas.width, canvas.height);
            canvas.convertToBlob({ type: 'image/jpg', quality: 0.9 })
            .then(blob => {
                const canvasReader = new FileReader();
                canvasReader.onloadend = function() {
                    // store as a data url for uploading in the
                    if (typeof canvasReader.result === "string") {
                        setHeadshotData(canvasReader.result);
                    }
                };
                canvasReader.readAsDataURL(blob);
            });
        }
    }

    function processImage(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(readerEvent) {
                if (headshot.current && readerEvent.target && typeof readerEvent.target.result === "string") {
                    headshot.current.onload = scaleHeadshot;
                    setheadshotSource(readerEvent.target.result);
                }
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    }
    function onCaptcha(token: string | null) {
        setCaptchaData(token);
    }

    return (
        <form method="POST" action="/letter" onSubmit={handleSubmit}>
            <div className="flow-root">
                <div id="return-address" className="w-2/3 md:w-1/3 md:float-right">
                    <i>
                        from:
                    </i>
                    <p>
                        {address.name} <br />
                        {address.street} <br />
                        {address.line2} {address.line2 && <br />}
                        {address.city}, {address.state} {address.zipcode}
                    </p>
                </div>
            </div>
            <div className="flow-root">
                <div className="w-2/3 md:w-1/2 md:float-left">
                    <div className="flex flex-row">
                        {reps.map((rep: Rep) =>
                            <img className="w-1/3 m-1" src={rep.photoURL} alt={rep.fullName} key={rep.id}/>
                        )}
                    </div>
                    <p>
                        {today}
                    </p>
                    {reps.map((rep: Rep) =>
                        <p className="m-0" key={rep.id}>
                            The Honorable {rep.fullName},
                        </p>
                    )}
                </div>
            </div>
            <div className="grid w-full gap-2 min-h-32 h-fit">
                <TextareaAutosize id="message" name="message"
                    maxLength={maxMessageLength}
                    minLength={minMessageLength}
                    autoFocus={true}
                    minRows={7}
                    value={messageContent}
                    onChange={handleMessageChange}
                    placeholder={messagePlaceholder} />
            </div>

            <div className="flow-root w-full">
                {messageLength < minMessageLength && 
                    <div className='float-left text-red-600'>
                        Please write a message that is at least 100 characters long.
                    </div>
                }
                <div className={[
                    'float-right',
                    messageLength < minMessageLength ? 'text-red-600' :
                    messageLength > redMessageLength ? 'text-red-600' :
                    messageLength > yellowMessageLength ? 'text-yellow-600' :
                    'text-black'
                ].join(' ')}>
                    {messageLength} / {maxMessageLength}
                </div>
            </div>
            
            <div className="flow-root">
                <div className="w-2/3 md:w-1/2 md:float-right">
                    <div className="flex md:flex-row flex-col">
                        <img className="w-1/3 rounded-md m-2"
                             id="headshot"
                             alt="your photo here"
                             src={headshotSource}
                             ref={headshot}/>
                    </div>
                    <p>
                    <input className="hidden"
                            type="file"
                            id="image-upload" name="image-upload"
                            accept="image/png, image/jpeg"
                            ref={uploadInput}
                            onChange={processImage}/>
                    <Button type="button"
                            id="image-upload-button"
                            onClick={initiateUpload}
                            key="image_upload"
                            >
                        Choose Photo
                    </Button>
                    </p>
                    <p>
                        Sincerely yours,
                    </p>
                    <p>
                        {address.name}
                    </p>
                    {SHOW_CAPTCHA && (
                        <ReCAPTCHA
                            id="captcha"
                            sitekey={RECAPTCHA_SITE_KEY}
                            onChange={onCaptcha}
                        />)}
                    <Button data-testid="draft-submit" id="submit" type="submit" disabled={isSubmitting || captchaData === null || messageLength < minMessageLength} className="flex items-center justify-center px-4 py-2">
                        {isSubmitting && (
                            <svg className={"animate-spin h-4 w-4 text-white"} viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        )}
                        {!isSubmitting && captchaData === null && (
                            <span> Please Verify </span>
                        )}
                        {!isSubmitting && captchaData !== null && (
                            <span> Submit </span>
                        )}
                    </Button>
                    <input type="hidden" id="envelope" name="envelope" value={JSON.stringify(envelope)} />
                    <input type="hidden" id="today" name="today" value={today} />
                    <input type="hidden" id="headshot-data" name="headshot-data" value={headshotData} />
                    <input type="hidden" id="captcha-data" name="captcha-data" value={captchaData ? captchaData : ""} />
                </div>
            </div>
        </form>
    );
}
