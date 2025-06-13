"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { type Address, type Reps } from '@/scripts/letter-state.js';
import profileRef from '../../assets/profile.png';

import React, { useState } from "react";

const today = new Date().toLocaleString('default', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

type Props = {
    address: Address,
    reps: Reps,
};

export default function Draft(props: Props) {
    const address = props.address;
    const reps = props.reps;

    const [isSubmitting, setIsSubmitting] = useState(false);


    function handleSubmit() {
        setIsSubmitting(true);
    }

    return (
        <form method="POST" action="/letter" onSubmit={handleSubmit}>
            <div className="flow-root">
                <div className="w-2/3 md:w-1/3 md:float-right">
                    <i>
                        from:
                    </i>
                    <p>
                        {address.name} <br />
                        {address.street} <br />
                        {address.city}, {address.state} {address.zipcode}
                    </p>
                </div>
            </div>
            <div className="flow-root">
                <div className="w-2/3 md:w-1/2 md:float-left">
                    <div className="flex flex-row">
                        {reps.map((rep: { [x: string]: string; }) =>
                            <img className="w-1/3 m-1" src={rep['photoURL']} alt={rep['name']} />
                        )}
                    </div>
                    <p>
                        {today}
                    </p>
                    {reps.map((rep: { [x: string]: string; }) =>
                        <p className="m-0">
                            The Honorable {rep['name']},
                        </p>
                    )}
                </div>
            </div>
            <div className="grid w-full gap-2 h-48">
                <Textarea id="message" name="message"
                    placeholder="On this occasion, I write to you on a topic of grave importance." />
            </div>
            <div className="flow-root">
                <div className="w-2/3 md:w-1/2 md:float-right">
                    <div className="flex md:flex-row flex-col">
                        <img className="w-1/3" src={profileRef.src} alt="your photo here" />
                    </div>
                    <p>
                        Sincerely yours,
                    </p>
                    <p>
                        {address.name}
                    </p>
                    <Button type="submit" disabled={isSubmitting} className="flex items-center justify-center px-4 py-2">
                        {isSubmitting && (
                            <svg className={"animate-spin h-4 w-4 text-white"} viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        )}
                        {!isSubmitting && (
                            <span> Submit </span>
                        )}
                    </Button>
                    <input type="hidden" id="name" name="name" value={address.name} />
                    <input type="hidden" id="street" name="street" value={address.street} />
                    <input type="hidden" id="city" name="city" value={address.city} />
                    <input type="hidden" id="state" name="state" value={address.state} />
                    <input type="hidden" id="zipcode" name="zipcode" value={address.zipcode} />
                    <input type="hidden" id="today" name="today" value={today} />
                    {reps.map((rep: { [x: string]: string; }, i: number) =>
                        <input type="hidden" id={"senator" + i} name={"senator" + i} value={rep['name']} />
                    )}
                </div>
            </div>
        </form>
    );
}