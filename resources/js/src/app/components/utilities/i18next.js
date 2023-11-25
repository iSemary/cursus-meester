import i18next from "i18next";
import Backend from "i18next-http-backend";
import { useEffect } from "react";

i18next.use(Backend).init({
    lng: "en",
    debug: true,
    fallbackLng: "en",
    backend: {
        loadPath: "/locales/en.json",
    },
    // load: "languageOnly",
});
export default i18next;
