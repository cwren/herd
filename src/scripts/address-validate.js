import { USPSValidator } from "@/scripts/address-usps"
import { MapsValidator } from "@/scripts/address-maps"
import { AddressStatus } from '@/scripts/letter-state'
import { allStateNamesAndCodes, zipRegExp } from "@/scripts/states";
import { VALIDATORS } from "astro:env/server";

/**
 * valid anmes for VALIDATORS configuration variable.
 */
const validatorByName = {
    "usps": USPSValidator,
    "maps": MapsValidator,
};

export async function validateAddress(address) {
    if (!address.name
        || !address.street 
        || !address.city 
        || !address.state
        || !allStateNamesAndCodes.includes(address.state.toUpperCase())
        || !address.zipcode
        || !address["zipcode"].match(zipRegExp)) {
        address.status = AddressStatus.ERROR;
        address.notes = "Address is missing required information.";
        return address;
    }

    var result = null;
    for (var validatorName of VALIDATORS.split(/[, ]+/)) {
        try {
            var validator = new validatorByName[validatorName]();
            result = await validator.validateAddress(address);
            if (! [AddressStatus.QUOTA, AddressStatus.ERROR].includes(result.status)) {
                return result;
            }
        } catch (error) {
            if (error instanceof TypeError) {
                console.error('bad configuration, unknown validator:', validatorName);
            } else {
                console.warn('validation failed, trying next validator', error);
            }
        }
    }

    if (result === null) {
        // otherwise return the final error from the validators
        address.status = AddressStatus.ERROR;
        address.notes = "There has been a technical error, please try back later.";
    }

    return result;
}
