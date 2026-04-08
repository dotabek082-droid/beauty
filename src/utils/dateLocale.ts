import { uz, ru, enUS, kk, tr } from 'date-fns/locale';

// Map app language codes to date-fns locales
const localeMap: Record<string, any> = {
    uz: uz,
    kaa: uz, // Fallback to Uzbek for Karakalpak
    ru: ru,
    en: enUS,
    kk: kk, // Kazakh
    ky: ru, // Kyrgyz -> Russian (fallback since ky not available)
    tg: ru, // Tajik -> Russian (fallback since tg not available)
    tk: tr, // Turkmen -> Turkish (closest available match)
};

export const getDateLocale = (lang: string) => {
    return localeMap[lang] || uz;
};
