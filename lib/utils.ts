import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PLACEHOLDER_BACKDROP_URL, PLACEHOLDER_POSTER_URL } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPosterUrl = (
  posterPath: string | null,
  highQuality: boolean = false,
) => {
  if (!posterPath) return PLACEHOLDER_POSTER_URL;
  return `https://image.tmdb.org/t/p/${highQuality ? "w1920" : "w500"}${posterPath}`;
};

export const getBackdropUrl = (backdropPath: string | null) => {
  if (!backdropPath) return PLACEHOLDER_BACKDROP_URL;
  return `https://image.tmdb.org/t/p/w1280${backdropPath}`;
};

export const getProfileUrl = (profilePath: string | null) => {
  if (!profilePath) return undefined;
  return `https://image.tmdb.org/t/p/original${profilePath}`;
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
  return `https://image.tmdb.org/t/p/original${logoPath}`;
};

export const getEmbedUrl = (site: string, key: string) => {
  switch (site) {
    case "YouTube":
      return `https://www.youtube.com/embed/${key}?autoplay=1&rel=0&modestbranding=1`;
    case "Vimeo":
      return `https://player.vimeo.com/video/${key}?autoplay=1&title=0&byline=0&portrait=0`;
    default:
      return "#";
  }
};

// Helper function to get video URL based on site
export const getVideoUrl = (site: string, key: string) => {
  switch (site) {
    case "YouTube":
      return `https://www.youtube.com/watch?v=${key}`;
    case "Vimeo":
      return `https://vimeo.com/${key}`;
    default:
      return "#";
  }
};

// Helper function to get thumbnail URL based on site
export const getThumbnailUrl = (site: string, key: string) => {
  switch (site) {
    case "YouTube":
      return `https://img.youtube.com/vi/${key}/maxresdefault.jpg`;
    case "Vimeo":
      return `https://vumbnail.com/${key}.jpg`;
    default:
      return PLACEHOLDER_BACKDROP_URL;
  }
};

// Helper function to get fallback thumbnail URL
export const getFallbackThumbnailUrl = (site: string, key: string) => {
  switch (site) {
    case "YouTube":
      return `https://img.youtube.com/vi/${key}/hqdefault.jpg`;
    default:
      return PLACEHOLDER_BACKDROP_URL;
  }
};

// Helper function to convert SVG to PNG for Clerk (Clerk doesn't support SVG directly)
export const convertSvgToPng = async (dataUri: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // Use 512x512 as default size for avatars
      canvas.width = img.width || 512;
      canvas.height = img.height || 512;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to convert SVG to PNG"));
        }
      }, "image/png");
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUri;
  });
};

// Helper function to convert data URI to Blob with proper MIME type
export const dataUriToBlob = (dataUri: string): Blob => {
  const [mimePart, data] = dataUri.split(",");

  // Extract MIME type more robustly
  let mimeType = "image/png"; // default
  if (mimePart.includes("image/svg+xml")) {
    // For Clerk, we need to convert SVG to PNG or another supported format
    // But for now, let's just set it to SVG and handle conversion if needed
    mimeType = "image/svg+xml";
  } else if (mimePart.includes("image/png")) {
    mimeType = "image/png";
  } else if (
    mimePart.includes("image/jpeg") ||
    mimePart.includes("image/jpg")
  ) {
    mimeType = "image/jpeg";
  } else if (mimePart.includes("image/gif")) {
    mimeType = "image/gif";
  } else if (mimePart.includes("image/webp")) {
    mimeType = "image/webp";
  } else {
    // Try to extract from the data URI format
    const match = mimePart.match(/:(.*?);/);
    if (match && match[1]) {
      mimeType = match[1];
    }
  }

  // For non-base64 data (like URL-encoded SVG), decode it
  const decodedData = mimePart.includes("base64")
    ? data
    : decodeURIComponent(data);

  if (mimePart.includes("base64")) {
    const byteCharacters = atob(decodedData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  } else {
    // For URL-encoded data, create blob with the decoded string
    return new Blob([decodedData], { type: mimeType });
  }
};
