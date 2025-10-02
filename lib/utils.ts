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
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIHZpZXdCb3g9IjAgMCAxMjgwIDcyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyODAiIGhlaWdodD0iNzIwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjY0MCIgeT0iMzYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2NjY2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiPk5vIEJhY2tkcm9wIEF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+";
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

export const getProviderLogoUrl = (logoPath: string | null) => {
  if (!logoPath) return null;
  return `https://image.tmdb.org/t/p/w92${logoPath}`;
};
