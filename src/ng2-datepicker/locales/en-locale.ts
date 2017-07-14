import { ILocale } from "./locale-manager";

export class EnglishLocale implements ILocale{
    langIdentifier(): string {
        return "en";
    }
    daysOfWeek(): string[] {
        return ["S", "M", "T", "w", "T", "F", "S"];
    }
    clearText(): string {
        return "Clear";
    }
    todayText(): string {
        return "Today";
    }
    selectYearText(): string {
        return "Select Year";
    }

}