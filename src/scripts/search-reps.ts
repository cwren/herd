import okData from "@/scripts/dev-data"
import { type Address, type Envelope, type Rep } from '@/scripts/letter-state.js';
import { signEnvelope } from "@/scripts/crypto";

const isDev = import.meta.env.DEV;
const apiKey = import.meta.env.FIVECALLS_API;

export async function searchReps (origin: string, address: Address) {
    var data = undefined;
    if (isDev && address["name"] !== "fetch") {
        if (address["name"] === "error") {
            console.log('using error dev data');
        } else {
            console.log('using ok dev data');
            data = okData;
        }
    } else {
        console.log('fetching real data');
        const location = encodeURIComponent(`${address["state"]} ${address["zipcode"]}`);
        const searchUrl = `https://api.5calls.org/v1/representatives?location=${location}`;
        const response = await fetch(searchUrl, {
            method: 'GET',
            headers: {
                'X-5Calls-Token': apiKey,
            },
        });
        if (response.ok) {
            data = await response.json();
        }
    }
    var reps = (
        'representatives' in data
        ? data['representatives'].filter((rep:any) => rep['area'] === 'US Senate') 
        : []);
    
    reps = reps.map((rep: Record<string, string>) => {
        const last = rep['name'].split(' ').slice(1).join("_");
        return {
            id: `${last}_${rep.state}`,
            fullName: rep['name'],
            salutation: rep['name'],
            photoURL: rep['photoURL'],
            state: rep['state'],
            office: "unknown",
        };
    });

    reps = await Promise.all(reps.map(async (rep: Rep) => {
        // see if we have authoritative data from the cached phonebook
        const response = await fetch(new URL(`/api/office_${rep.id}.json`, origin));
        if (response.ok) {
            const details = await response.json();
            rep.fullName  = details["fullname"];
            rep.salutation = details["lastname"];
            rep.office = details["office"];
        }
        return rep;
    }));

    var envelope: Envelope = {
        address: address,
        reps: reps,
        signature: "",
    };
    envelope.signature = signEnvelope(envelope);
    return(envelope);
}