import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import de from "./translations/de.json";
import en from "./translations/en.json";
import cn from "./translations/cn.json";
import id from "./translations/id.json";
import ja from "./translations/ja.json";

const resources = {
  de: { translation: de },
  en: { translation: en },
  cn: { translation: cn },
  id: { translation: id },
  ja: { translation: ja },
};

i18next.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources,
});

export default i18next;
