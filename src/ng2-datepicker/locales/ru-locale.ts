import { ILocale } from "./locale-manager";

export class RussianLocale implements ILocale{
    firstWeekdaySunday(): boolean {
        return false;
    }
    langIdentifier(): string {
        return "ru";
    }
    daysOfWeek(): string[] {
        return ["Вск", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    }
    clearText(): string {
        return "Очистить";
    }
    todayText(): string {
        return "Сегодня";
    }
    selectYearText(): string {
        return "Выбрать год";
    }

}