import { ConvertDateToString, DateFormat } from "guden-core";
import { useTranslation } from "react-i18next";

export const BasePage = () => {
    const { t } = useTranslation();
    const getTranslation = (key: string): string => {
        return t(key);
    }
    const convertDate = (date: string, format: DateFormat = DateFormat.DDMMYYYYP) => {
        const dateFormat = new Date(date);
        return ConvertDateToString(dateFormat, format);
    };
    return {
        getTranslation,
        convertDate
    }
}