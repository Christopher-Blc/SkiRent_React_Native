import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import de from '../locales/de.json';


export const languageResources = {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    de: { translation: de },
};

// in this snippet is being initialized so we can use the lib
i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'fr', 'de'],
    resources: languageResources
});

export default i18next;
