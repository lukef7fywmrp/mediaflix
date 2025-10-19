import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPosterUrl = (posterPath: string | null) => {
  if (!posterPath) return "/placeholder-tv.jpg";
  return `https://image.tmdb.org/t/p/w500${posterPath}`;
};

export const getBackdropUrl = (backdropPath: string | null) => {
  if (!backdropPath)
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIHZpZXdCb3g9IjAgMCAxMjgwIDcyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyODAiIGhlaWdodD0iNzIwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjY0MCIgeT0iMzYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2NjY2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiPk5vIEJhY2tkcm9wIEF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+";
  return `https://image.tmdb.org/t/p/w1280${backdropPath}`;
};

export const getProfileUrl = (profilePath: string | null) => {
  if (!profilePath) return undefined;
  return `https://image.tmdb.org/t/p/w185${profilePath}`;
};

export const formatRuntime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatOrdinal = (num: number) => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return num + "st";
  }
  if (j === 2 && k !== 12) {
    return num + "nd";
  }
  if (j === 3 && k !== 13) {
    return num + "rd";
  }
  return num + "th";
};

export const formatDateShort = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Language code to full name mapping
const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  hi: "Hindi",
  ar: "Arabic",
  nl: "Dutch",
  sv: "Swedish",
  da: "Danish",
  no: "Norwegian",
  fi: "Finnish",
  pl: "Polish",
  tr: "Turkish",
  th: "Thai",
  vi: "Vietnamese",
  cs: "Czech",
  hu: "Hungarian",
  ro: "Romanian",
  bg: "Bulgarian",
  hr: "Croatian",
  sk: "Slovak",
  sl: "Slovenian",
  et: "Estonian",
  lv: "Latvian",
  lt: "Lithuanian",
  el: "Greek",
  he: "Hebrew",
  fa: "Persian",
  ur: "Urdu",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  ml: "Malayalam",
  kn: "Kannada",
  gu: "Gujarati",
  pa: "Punjabi",
  mr: "Marathi",
  ne: "Nepali",
  si: "Sinhala",
  my: "Burmese",
  km: "Khmer",
  lo: "Lao",
  ka: "Georgian",
  am: "Amharic",
  sw: "Swahili",
  zu: "Zulu",
  af: "Afrikaans",
  sq: "Albanian",
  az: "Azerbaijani",
  be: "Belarusian",
  bs: "Bosnian",
  ca: "Catalan",
  cy: "Welsh",
  eu: "Basque",
  gl: "Galician",
  is: "Icelandic",
  ga: "Irish",
  mk: "Macedonian",
  mt: "Maltese",
  sr: "Serbian",
  uk: "Ukrainian",
  uz: "Uzbek",
  kk: "Kazakh",
  ky: "Kyrgyz",
  tg: "Tajik",
  mn: "Mongolian",
  bo: "Tibetan",
  ms: "Malay",
  tl: "Filipino",
  id: "Indonesian",
  jv: "Javanese",
  su: "Sundanese",
  ceb: "Cebuano",
  war: "Waray",
  ilo: "Ilocano",
  haw: "Hawaiian",
  sm: "Samoan",
  to: "Tongan",
  fj: "Fijian",
  ty: "Tahitian",
  mi: "Maori",
  rn: "Kirundi",
  rw: "Kinyarwanda",
  lg: "Luganda",
  om: "Oromo",
  so: "Somali",
  ti: "Tigrinya",
  wo: "Wolof",
  yo: "Yoruba",
  ig: "Igbo",
  ha: "Hausa",
  ff: "Fulani",
  dy: "Dyula",
  bm: "Bambara",
  sg: "Sango",
  ln: "Lingala",
  kg: "Kongo",
  lu: "Luba-Katanga",
  ny: "Chichewa",
  sn: "Shona",
  ts: "Tsonga",
  ve: "Venda",
  xh: "Xhosa",
  st: "Sesotho",
  tn: "Setswana",
  ss: "Swati",
  nr: "Southern Ndebele",
  nso: "Northern Sotho",
  tso: "Tsonga",
  ven: "Venda",
  xho: "Xhosa",
  sot: "Sesotho",
  tsw: "Setswana",
  ssw: "Swati",
  nbl: "Southern Ndebele",
};

export const formatLanguage = (languageCode: string) => {
  return LANGUAGE_MAP[languageCode.toLowerCase()] || languageCode.toUpperCase();
};

export const formatLargeNumber = (amount: number) => {
  if (amount >= 1_000_000_000) {
    const billions = Math.round(amount / 1_000_000_000);
    return `${billions} billion`;
  } else if (amount >= 1_000_000) {
    const millions = Math.round(amount / 1_000_000);
    return `${millions} million`;
  } else if (amount >= 1_000) {
    const thousands = Math.round(amount / 1_000);
    return `${thousands} thousand`;
  } else {
    return formatCurrency(amount);
  }
};

export const formatPopularity = (popularity: number) => {
  // TMDB popularity is typically between 0-1000+, so we'll show it as a score out of 100
  const percentage = Math.min((popularity / 1000) * 100, 100);
  return `${Math.round(percentage)}%`;
};

// Language code to country code mapping for flag display
const LANGUAGE_TO_COUNTRY_MAP: Record<string, string> = {
  en: "US",
  es: "ES",
  fr: "FR",
  de: "DE",
  it: "IT",
  pt: "PT",
  ru: "RU",
  ja: "JP",
  ko: "KR",
  zh: "CN",
  ar: "SA",
  hi: "IN",
  th: "TH",
  vi: "VN",
  tr: "TR",
  pl: "PL",
  nl: "NL",
  sv: "SE",
  da: "DK",
  no: "NO",
  fi: "FI",
  cs: "CZ",
  hu: "HU",
  ro: "RO",
  bg: "BG",
  hr: "HR",
  sk: "SK",
  sl: "SI",
  et: "EE",
  lv: "LV",
  lt: "LT",
  el: "GR",
  he: "IL",
  fa: "IR",
  ur: "PK",
  bn: "BD",
  ta: "LK",
  te: "IN",
  ml: "IN",
  kn: "IN",
  gu: "IN",
  pa: "IN",
  or: "IN",
  as: "IN",
  ne: "NP",
  si: "LK",
  my: "MM",
  km: "KH",
  lo: "LA",
  ka: "GE",
  am: "ET",
  sw: "KE",
  zu: "ZA",
  af: "ZA",
  xh: "ZA",
  yo: "NG",
  ig: "NG",
  ha: "NG",
  wo: "SN",
  ff: "SN",
  rw: "RW",
  rn: "BI",
  ny: "MW",
  sn: "ZW",
  st: "LS",
  ss: "SZ",
  nr: "ZA",
  nso: "ZA",
  tn: "BW",
  ts: "ZA",
  ve: "ZA",
};

export const getCountryCodeForLanguage = (languageCode: string): string => {
  return LANGUAGE_TO_COUNTRY_MAP[languageCode] || "UN";
};

// Historical and invalid country codes mapping
// Based on actual TMDB API response - these codes appear in production_countries
// fallbackCode is the ISO code that ReactCountryFlag supports for flag display
const HISTORICAL_COUNTRY_MAP: Record<
  string,
  { name: string; fallbackCode: string }
> = {
  SU: { name: "Soviet Union", fallbackCode: "RU" },
  YU: { name: "Yugoslavia", fallbackCode: "RS" },
  CS: { name: "Serbia and Montenegro", fallbackCode: "RS" },
  XC: { name: "Czechoslovakia", fallbackCode: "CZ" },
  XG: { name: "East Germany", fallbackCode: "DE" },
  AN: { name: "Netherlands Antilles", fallbackCode: "NL" },
  BU: { name: "Burma", fallbackCode: "MM" },
  ZR: { name: "Zaire", fallbackCode: "CD" },
  TP: { name: "East Timor", fallbackCode: "TL" },
  XI: { name: "Northern Ireland", fallbackCode: "GB" },
  XK: { name: "Kosovo", fallbackCode: "XK" }, // Kosovo has its own flag
};

// Helper function to get valid country code for flags
export const getValidCountryCodeForFlag = (countryCode: string): string => {
  const historical = HISTORICAL_COUNTRY_MAP[countryCode];
  if (historical) {
    return historical.fallbackCode;
  }

  // Special case: Kosovo (XK) has its own flag
  if (countryCode === "XK") {
    return "XK";
  }

  // If it's a valid country code, return as-is
  if (COUNTRY_CODE_TO_NAME_MAP[countryCode]) {
    return countryCode;
  }

  // Fallback to UN (United Nations) for unknown codes
  return "UN";
};

// Helper function to get country name (including historical)
export const getCountryNameWithHistory = (countryCode: string): string => {
  const historical = HISTORICAL_COUNTRY_MAP[countryCode];
  if (historical) {
    return historical.name;
  }

  // Try to get from the main country map
  const countryName = getCountryName(countryCode);
  if (countryName !== countryCode) {
    return countryName;
  }

  // Fallback to the original code if unknown
  return countryCode;
};

// Country code to country name mapping
const COUNTRY_CODE_TO_NAME_MAP: Record<string, string> = {
  AD: "Andorra",
  AE: "United Arab Emirates",
  AF: "Afghanistan",
  AG: "Antigua and Barbuda",
  AI: "Anguilla",
  AL: "Albania",
  AM: "Armenia",
  AO: "Angola",
  AQ: "Antarctica",
  AR: "Argentina",
  AS: "American Samoa",
  AT: "Austria",
  AU: "Australia",
  AW: "Aruba",
  AX: "Åland Islands",
  AZ: "Azerbaijan",
  BA: "Bosnia and Herzegovina",
  BB: "Barbados",
  BD: "Bangladesh",
  BE: "Belgium",
  BF: "Burkina Faso",
  BG: "Bulgaria",
  BH: "Bahrain",
  BI: "Burundi",
  BJ: "Benin",
  BL: "Saint Barthélemy",
  BM: "Bermuda",
  BN: "Brunei",
  BO: "Bolivia",
  BQ: "Caribbean Netherlands",
  BR: "Brazil",
  BS: "Bahamas",
  BT: "Bhutan",
  BV: "Bouvet Island",
  BW: "Botswana",
  BY: "Belarus",
  BZ: "Belize",
  CA: "Canada",
  CC: "Cocos Islands",
  CD: "Democratic Republic of the Congo",
  CF: "Central African Republic",
  CG: "Republic of the Congo",
  CH: "Switzerland",
  CI: "Côte d'Ivoire",
  CK: "Cook Islands",
  CL: "Chile",
  CM: "Cameroon",
  CN: "China",
  CO: "Colombia",
  CR: "Costa Rica",
  CU: "Cuba",
  CV: "Cape Verde",
  CW: "Curaçao",
  CX: "Christmas Island",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DE: "Germany",
  DJ: "Djibouti",
  DK: "Denmark",
  DM: "Dominica",
  DO: "Dominican Republic",
  DZ: "Algeria",
  EC: "Ecuador",
  EE: "Estonia",
  EG: "Egypt",
  EH: "Western Sahara",
  ER: "Eritrea",
  ES: "Spain",
  ET: "Ethiopia",
  FI: "Finland",
  FJ: "Fiji",
  FK: "Falkland Islands",
  FM: "Micronesia",
  FO: "Faroe Islands",
  FR: "France",
  GA: "Gabon",
  GB: "United Kingdom",
  GD: "Grenada",
  GE: "Georgia",
  GF: "French Guiana",
  GG: "Guernsey",
  GH: "Ghana",
  GI: "Gibraltar",
  GL: "Greenland",
  GM: "Gambia",
  GN: "Guinea",
  GP: "Guadeloupe",
  GQ: "Equatorial Guinea",
  GR: "Greece",
  GS: "South Georgia and the South Sandwich Islands",
  GT: "Guatemala",
  GU: "Guam",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HK: "Hong Kong",
  HM: "Heard Island and McDonald Islands",
  HN: "Honduras",
  HR: "Croatia",
  HT: "Haiti",
  HU: "Hungary",
  ID: "Indonesia",
  IE: "Ireland",
  IL: "Israel",
  IM: "Isle of Man",
  IN: "India",
  IO: "British Indian Ocean Territory",
  IQ: "Iraq",
  IR: "Iran",
  IS: "Iceland",
  IT: "Italy",
  JE: "Jersey",
  JM: "Jamaica",
  JO: "Jordan",
  JP: "Japan",
  KE: "Kenya",
  KG: "Kyrgyzstan",
  KH: "Cambodia",
  KI: "Kiribati",
  KM: "Comoros",
  KN: "Saint Kitts and Nevis",
  KP: "North Korea",
  KR: "South Korea",
  KW: "Kuwait",
  KY: "Cayman Islands",
  KZ: "Kazakhstan",
  LA: "Laos",
  LB: "Lebanon",
  LC: "Saint Lucia",
  LI: "Liechtenstein",
  LK: "Sri Lanka",
  LR: "Liberia",
  LS: "Lesotho",
  LT: "Lithuania",
  LU: "Luxembourg",
  LV: "Latvia",
  LY: "Libya",
  MA: "Morocco",
  MC: "Monaco",
  MD: "Moldova",
  ME: "Montenegro",
  MF: "Saint Martin",
  MG: "Madagascar",
  MH: "Marshall Islands",
  MK: "North Macedonia",
  ML: "Mali",
  MM: "Myanmar",
  MN: "Mongolia",
  MO: "Macau",
  MP: "Northern Mariana Islands",
  MQ: "Martinique",
  MR: "Mauritania",
  MS: "Montserrat",
  MT: "Malta",
  MU: "Mauritius",
  MV: "Maldives",
  MW: "Malawi",
  MX: "Mexico",
  MY: "Malaysia",
  MZ: "Mozambique",
  NA: "Namibia",
  NC: "New Caledonia",
  NE: "Niger",
  NF: "Norfolk Island",
  NG: "Nigeria",
  NI: "Nicaragua",
  NL: "Netherlands",
  NO: "Norway",
  NP: "Nepal",
  NR: "Nauru",
  NU: "Niue",
  NZ: "New Zealand",
  OM: "Oman",
  PA: "Panama",
  PE: "Peru",
  PF: "French Polynesia",
  PG: "Papua New Guinea",
  PH: "Philippines",
  PK: "Pakistan",
  PL: "Poland",
  PM: "Saint Pierre and Miquelon",
  PN: "Pitcairn Islands",
  PR: "Puerto Rico",
  PS: "Palestine",
  PT: "Portugal",
  PW: "Palau",
  PY: "Paraguay",
  QA: "Qatar",
  RE: "Réunion",
  RO: "Romania",
  RS: "Serbia",
  RU: "Russia",
  RW: "Rwanda",
  SA: "Saudi Arabia",
  SB: "Solomon Islands",
  SC: "Seychelles",
  SD: "Sudan",
  SE: "Sweden",
  SG: "Singapore",
  SH: "Saint Helena",
  SI: "Slovenia",
  SJ: "Svalbard and Jan Mayen",
  SK: "Slovakia",
  SL: "Sierra Leone",
  SM: "San Marino",
  SN: "Senegal",
  SO: "Somalia",
  SR: "Suriname",
  SS: "South Sudan",
  ST: "São Tomé and Príncipe",
  SV: "El Salvador",
  SX: "Sint Maarten",
  SY: "Syria",
  SZ: "Eswatini",
  TC: "Turks and Caicos Islands",
  TD: "Chad",
  TF: "French Southern Territories",
  TG: "Togo",
  TH: "Thailand",
  TJ: "Tajikistan",
  TK: "Tokelau",
  TL: "Timor-Leste",
  TM: "Turkmenistan",
  TN: "Tunisia",
  TO: "Tonga",
  TR: "Turkey",
  TT: "Trinidad and Tobago",
  TV: "Tuvalu",
  TW: "Taiwan",
  TZ: "Tanzania",
  UA: "Ukraine",
  UG: "Uganda",
  UM: "United States Minor Outlying Islands",
  US: "United States",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VA: "Vatican City",
  VC: "Saint Vincent and the Grenadines",
  VE: "Venezuela",
  VG: "British Virgin Islands",
  VI: "U.S. Virgin Islands",
  VN: "Vietnam",
  VU: "Vanuatu",
  WF: "Wallis and Futuna",
  WS: "Samoa",
  YE: "Yemen",
  YT: "Mayotte",
  ZA: "South Africa",
  ZM: "Zambia",
  ZW: "Zimbabwe",
};

export const getCountryName = (countryCode: string): string => {
  return COUNTRY_CODE_TO_NAME_MAP[countryCode] || countryCode;
};

export const getProviderLogoUrl = (logoPath: string | null) => {
  if (!logoPath) return null;
  return `https://image.tmdb.org/t/p/w92${logoPath}`;
};
