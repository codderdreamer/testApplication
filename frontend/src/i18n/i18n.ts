import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import EN from './locales/en.json'
import TR from './locales/tr.json'

const resources = {
  en: {
    translation: EN
  },
  tr: {
    translation: TR
  }
}

localStorage.setItem('lang',"tr")

i18next.use(initReactI18next).init({
  resources,
  fallbackLng: 'tr',
  lng: localStorage.getItem('lang') || 'tr',
  interpolation: { escapeValue: false }
})

export default i18next
