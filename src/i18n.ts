import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { SUPPORTED_LOCALES } from "./utils/locales";

// NOTE: keep the init config minimal. Options like `load: "currentOnly"`
// or `nonExplicitSupportedLngs: true` interfere with i18next's internal
// language lookup chain for locales containing a hyphen (e.g. "zh-CN"),
// causing t('key') to return fallbackLng values even when the resource
// is correctly registered.

i18n
	.use(HttpBackend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: ["en"],
		supportedLngs: SUPPORTED_LOCALES,
		interpolation: { escapeValue: false },
		detection: {
			order: ["localStorage", "navigator"],
			caches: ["localStorage"],
		},
		backend: {
			loadPath: "/locales/{{lng}}/{{ns}}.json",
		},
	});

export default i18n;
