export enum AddressStatus {
    EMPTY,
    EXACT,
    INCOMPLETE,
    AMBIGUOUS,
    ERROR
};

export enum FlowStatus {
    ADDRESS,
    CORRECT,
    DRAFT,
    RECEIPT,
    ERROR,
    QUOTA
};
export type Address = {   
    name: string;
    street: string;
    line2: string;
    city: string;
    state: string;
    zipcode: string;
    email: string;
    subscribe: boolean;
    status: AddressStatus;
    notes: string;
};

export type Rep = {
    id: string;
    fullName: string;
    salutation: string;
    photoURL: string;
    state: string;
    office: string;
};

export type Reps = Array<Rep>;

export type Envelope = {
    address: Address;
    reps: Reps;
    signature: string;
} | null;

export type Letter = {
    url: string;
    recipient: string;
};

export const minMessageLength = 100;
export const maxMessageLength = 1000;

export function emptyAddress() : Address {
    return {
        name: '',
        street: '',
        line2: '',
        city: '',
        state: '',
        zipcode: '',
        email: '',
        subscribe: false,
        status: AddressStatus.EMPTY,
        notes: ''
    };
}