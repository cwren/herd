import axios from 'axios';

import { MAPS_KEY } from "astro:env/server";
import { AddressStatus } from '@/scripts/letter-state'

const MAPS_API_BASE_URL = 'https://addressvalidation.googleapis.com';

export class MapsValidator {
    constructor() {
    }
  
    async validateAddress(address) {
        console.log("using Maps API to validate an address");
        try {
            const data = JSON.stringify({
                address: {
                    regionCode: "US",
                    locality: address.city,
                    administrativeArea: address.state,
                    postalCode: address.zipcode,
                    addressLines: [
                        address.street,
                        address.line2,
                    ],
                },
                "enableUspsCass": true,
            });
            const uri = `${MAPS_API_BASE_URL}/v1:validateAddress` +
                `?key=${encodeURIComponent(MAPS_KEY)}`;
    
            const response = await axios.post(uri, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            var result = response.data.result;
            var retval = address;
            var zipcode = result.uspsData.standardizedAddress.zipCode;
            if (result.uspsData.standardizedAddress.zipCodeExtension) {
                zipcode += '-' + result.uspsData.standardizedAddress.zipCodeExtension;
            }
            retval.name = address.name;
            retval.street = result.uspsData.standardizedAddress.firstAddressLine;
            retval.line2 = "",
            retval.city = result.uspsData.standardizedAddress.city;
            retval.state = result.uspsData.standardizedAddress.state;
            retval.zipcode = zipcode;
            switch (result.uspsData.dpvConfirmation) {
                case "D":
                    retval.status = AddressStatus.INCOMPLETE;
                    retval.notes = "The address you entered was found but more information is needed (such as an apartment, suite, or box number) to match to a specific address.";
                    break;
                case "S":
                    retval.status = AddressStatus.AMBIGUOUS;
                    retval.notes = "The address you entered was found but more information is needed (such as an apartment, suite, or box number) to match to a specific address.";
                    break;
                case "Y":
                    retval.status = AddressStatus.EXACT;
                    retval.notes = "Single Response - exact match";
                    break;
                case "N":
                default:
                    retval.status = AddressStatus.AMBIGUOUS;
                    retval.notes = "The US Postal Service does not recognize this address.";
            }
            return retval;
        } catch (error) {
            console.error('Error validating address:', error.message);
            address.status = AddressStatus.ERROR;
            if (error.status == 429) {
                address.notes = "The site is experiencing unusually high load, please try again in a few minutes.";
            } else if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
                address.notes = error.response.data.error.message;
            } else {
                address.notes = "Technical Error, please try again later.";
            }
            return address;
        }
    }
}
