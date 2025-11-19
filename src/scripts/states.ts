export type StateList = Record<string, Record<string, string>>;
export type CodeList = Record<string, string>;
export const states: StateList = {
    'AL': {'name': 'Alabama', 'type': 'state'},
    'AK': {'name': 'Alaska', 'type': 'state'},
    'AZ': {'name': 'Arizona', 'type': 'state'},
    'AR': {'name': 'Arkansas', 'type': 'state'},
    'CA': {'name': 'California', 'type': 'state'},
    'CO': {'name': 'Colorado', 'type': 'state'},
    'CT': {'name': 'Connecticut', 'type': 'state'},
    'DE': {'name': 'Delaware', 'type': 'state'},
    'FL': {'name': 'Florida', 'type': 'state'},
    'GA': {'name': 'Georgia', 'type': 'state'},
    'HI': {'name': 'Hawaii', 'type': 'state'},
    'ID': {'name': 'Idaho', 'type': 'state'},
    'IL': {'name': 'Illinois', 'type': 'state'},
    'IN': {'name': 'Indiana', 'type': 'state'},
    'IA': {'name': 'Iowa', 'type': 'state'},
    'KS': {'name': 'Kansas', 'type': 'state'},
    'KY': {'name': 'Kentucky', 'type': 'state'},
    'LA': {'name': 'Louisiana', 'type': 'state'},
    'ME': {'name': 'Maine', 'type': 'state'},
    'MD': {'name': 'Maryland', 'type': 'state'},
    'MA': {'name': 'Massachusetts', 'type': 'state'},
    'MI': {'name': 'Michigan', 'type': 'state'},
    'MN': {'name': 'Minnesota', 'type': 'state'},
    'MS': {'name': 'Mississippi', 'type': 'state'},
    'MO': {'name': 'Missouri', 'type': 'state'},
    'MT': {'name': 'Montana', 'type': 'state'},
    'NE': {'name': 'Nebraska', 'type': 'state'},
    'NV': {'name': 'Nevada', 'type': 'state'},
    'NH': {'name': 'New Hampshire', 'type': 'state'},
    'NJ': {'name': 'New Jersey', 'type': 'state'},
    'NM': {'name': 'New Mexico', 'type': 'state'},
    'NY': {'name': 'New York', 'type': 'state'},
    'NC': {'name': 'North Carolina', 'type': 'state'},
    'ND': {'name': 'North Dakota', 'type': 'state'},
    'OH': {'name': 'Ohio', 'type': 'state'},
    'OK': {'name': 'Oklahoma', 'type': 'state'},
    'OR': {'name': 'Oregon', 'type': 'state'},
    'PA': {'name': 'Pennsylvania', 'type': 'state'},
    'RI': {'name': 'Rhode Island', 'type': 'state'},
    'SC': {'name': 'South Carolina', 'type': 'state'},
    'SD': {'name': 'South Dakota', 'type': 'state'},
    'TN': {'name': 'Tennessee', 'type': 'state'},
    'TX': {'name': 'Texas', 'type': 'state'},
    'UT': {'name': 'Utah', 'type': 'state'},
    'VT': {'name': 'Vermont', 'type': 'state'},
    'VA': {'name': 'Virginia', 'type': 'state'},
    'WA': {'name': 'Washington', 'type': 'state'},
    'WV': {'name': 'West Virginia', 'type': 'state'},
    'WI': {'name': 'Wisconsin', 'type': 'state'},
    'WY': {'name': 'Wyoming', 'type': 'state'},
    'DC': {'name': 'District of Columbia', 'type': 'district'},
    'AS': {'name': 'American Samoa', 'type': 'territory'},
    'GU': {'name': 'Guam', 'type': 'territory'},
    'MP': {'name': 'Northern Mariana Islands', 'type': 'territory'},
    'PR': {'name': 'Puerto Rico', 'type': 'territory'},
    'VI': {'name': 'U.S. Virgin Islands', 'type': 'territory'},
    'UM': {'name': 'U.S. Minor Outlying Islands', 'type': 'insular'},
    'XB': {'name': 'Baker Island', 'type': 'island'},
    'XH': {'name': 'Howland Island', 'type': 'island'},
    'XQ': {'name': 'Jarvis Island', 'type': 'island'},
    'XU': {'name': 'Johnston Atoll', 'type': 'atoll'},
    'XM': {'name': 'Kingman Reef', 'type': 'atoll'},
    'QM': {'name': 'Midway Atoll', 'type': 'atoll'},
    'XV': {'name': 'Navassa Island', 'type': 'island'},
    'XL': {'name': 'Palmyra Atoll', 'type': 'atoll'},
    'QW': {'name': 'Wake Island', 'type': 'atoll'},
    'MH': {'name': 'Marshall Islands', 'type': 'free'},
    'FM': {'name': 'Micronesia', 'type': 'free'},
    'PW': {'name': 'Palau', 'type': 'free'},
    'AA': {'name': 'U.S. Armed Forces - America', 'type': 'military'},
    'AE': {'name': 'U.S. Armed Forces - Europe', 'type': 'military'},
    'AP': {'name': 'U.S. Armed Forces - Pacific', 'type': 'military'},
};

function invert(s: StateList) : CodeList {
  const inverted: Record<string, string> = {};
  for (const code in s) {
    if (s.hasOwnProperty(code)) {
        var name: string = s[code]["name"].toUpperCase();
      inverted[name] = code
    }
  }
  return inverted;
}

const decoder: CodeList = invert(states);

export function stateDecoder(probe: string) : string {
    const ucProbe = probe.toUpperCase();
    if (states.hasOwnProperty(ucProbe)) {
        return ucProbe;
    }
    return decoder[ucProbe];
}

export const allStateNamesAndCodes = Object.keys(states).map(
  (key) => [key, states[key]["name"].toUpperCase()]).flat();

export const uspsCodesRegExp = /^(AA|AE|AL|AK|AP|AS|AZ|AR|CA|CO|CT|DE|DC|FM|FL|GA|GU|HI|ID|IL|IN|IA|KS|KY|LA|ME|MH|MD|MA|MI|MN|MS|MO|MP|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PW|PA|PR|RI|SC|SD|TN|TX|UT|VT|VI|VA|WA|WV|WI|WY|aa|ae|al|ak|ap|as|az|ar|ca|co|ct|de|dc|fm|fl|ga|gu|hi|id|il|in|ia|ks|ky|la|me|mh|md|ma|mi|mn|ms|mo|mp|mt|ne|nv|nh|nj|nm|ny|nc|nd|oh|ok|or|pw|pa|pr|ri|sc|sd|tn|tx|ut|vt|vi|va|wa|wv|wi|wy)$/;
  
export const zipRegExp = /(?<zip>^\d{5}$)|((?<zip5>^\d{5})-(?<plus4>\d{4}$))/;