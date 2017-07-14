import { Injectable } from "@angular/core";
import { EnglishLocale } from "./en-locale";
import { RussianLocale } from "./ru-locale";

export interface ILocale{
    todayText(): string;
    selectYearText(): string;
    clearText(): string;
    daysOfWeek(): string[];
    langIdentifier(): string;
    firstWeekdaySunday(): boolean;
}

export class ILocaleManager{
    Resolve(locale: string): ILocale{
        throw new Error("ILocaleManager is an pseudo interface. It cannot be used like a commin class.");
    }
}

@Injectable()
export class LocaleManager implements ILocaleManager{
    private _locales: ILocale[] = [];
    private _defaultLocale: ILocale = new EnglishLocale();
    
    public constructor(){
        this._locales["en"] = this._defaultLocale;
        this._locales["ru"] = new RussianLocale();
    }

    Resolve(locale: string): ILocale {
        let l = this._locales[locale];
        return (l)?l:this._defaultLocale;
    }

}