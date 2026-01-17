import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import fr from './locales/fr.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        translation: fr,
      },
    },
    lng: 'fr',
    fallbackLng: 'en', // Fallback to English if French translation is missing
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
