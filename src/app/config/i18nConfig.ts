import * as process from "process";
import * as path from "path";

export const i18nConfig = (): any => ({
  fallbackLanguage: process.env.APP_DEFAULT_LANGUAGE,
  loaderOptions: {
    path: path.join(__dirname, "/../../i18n"),
    watch: true
  }
});

export default i18nConfig;