import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Dil dosyalarını içe aktar
import en from './translations/en.json';
import tr from './translations/tr.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      tr: { translation: tr },
    },
    lng: 'tr', // Varsayılan dili ayarla
    fallbackLng: 'en', // Eğer bir çeviri bulunamazsa, İngilizceye düşer
    interpolation: { escapeValue: false },
  });

export default i18n;