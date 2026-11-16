// Hard-coded language list for production reliability.
// Using a static list instead of import.meta.glob because glob can fail to
// match locale directories with hyphens (e.g. zh-CN) in certain build configs,
// and the set of supported locales changes rarely. Add new locales here when
// a new translation file is added under public/locales/<code>/translation.json.
const HARDCODED_LOCALES = [
	"ar",
	"arz",
	"bs",
	"de",
	"dum",
	"en",
	"es",
	"es-419",
	"fr",
	"nl",
	"pt",
	"pt-BR",
	"sl",
	"zh-CN",
];

// Also try glob scan for forward-compatibility; merge with hard-coded list.
// Fallback so this file still works if someone adds locales without updating us.
const globbedLocales = (() => {
	try {
		const modules = import.meta.glob("../../public/locales/*/translation.json");
		const regex = /\/public\/locales\/([^/]+)\/translation\.json$/;
		return Object.keys(modules)
			.map((p) => p.match(regex)?.[1] ?? null)
			.filter((l): l is string => Boolean(l));
	} catch {
		return [] as string[];
	}
})();

const ALL_LOCALES = [...new Set([...HARDCODED_LOCALES, ...globbedLocales])].sort();

function getDisplayName(localeCode: string): string {
	try {
		const displayNames = new Intl.DisplayNames(["en"], { type: "language" });
		const name = displayNames.of(localeCode);
		if (!name) {
			return localeCode;
		}
		return `${name} (${localeCode})`;
	} catch {
		return localeCode;
	}
}

export const SUPPORTED_LOCALES = ALL_LOCALES;

export const SUPPORTED_LOCALE_OPTIONS = SUPPORTED_LOCALES.map((localeCode) => ({
	value: localeCode,
	label: getDisplayName(localeCode),
}));

export function resolveSupportedLocale(locale: string): string {
	if (SUPPORTED_LOCALES.includes(locale)) {
		return locale;
	}

	const languageOnly = locale.split("-")[0];
	if (SUPPORTED_LOCALES.includes(languageOnly)) {
		return languageOnly;
	}

	if (SUPPORTED_LOCALES.includes("en")) {
		return "en";
	}

	return SUPPORTED_LOCALES[0] ?? "en";
}
