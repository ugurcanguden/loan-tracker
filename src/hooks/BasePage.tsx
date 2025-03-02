import { useTranslation } from "react-i18next";

export const BasePage=()=>{
    const { t } = useTranslation();    
    const getTranslation=(key:string):string=>{
        return t(key);
    }
    return {
        getTranslation
    } 
}