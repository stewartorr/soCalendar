interface SoCalendarOptions {
    locale?: string;
    minDate?: Date;
    maxDate?: Date;
    selector?: string;
    dateFormat?: string;
    firstDay?: number;
}
export default class SoCalendar {
    private dialog;
    private content;
    private contentPrev;
    private contentCurrent;
    private contentNext;
    private monthLabel;
    private yearLabel;
    private todayBtn;
    private prevMonthBtn;
    private nextMonthBtn;
    private prevYearBtn;
    private nextYearBtn;
    private backBtn;
    private editBtn;
    private cancelBtn;
    private confirmBtn;
    private targetElement;
    private iconPreviousMonth;
    private iconNextMonth;
    private iconPreviousYear;
    private iconNextYear;
    private iconEdit;
    private iconBack;
    private iconToday;
    private iconCancel;
    private iconConfirm;
    private iconPreviousDecade;
    private iconNextDecade;
    private locale;
    private date;
    private today;
    private referenceDate;
    private minDate;
    private maxDate;
    private weekDays;
    private year;
    private month;
    private day;
    private selector;
    private dateFormat;
    private firstDay?;
    private dateRestrictions;
    private static shared;
    private readonly perTarget;
    private readonly defaults;
    private static readonly DEFAULTS;
    private configFor;
    init(selector?: string, options?: SoCalendarOptions): void;
    constructor();
    private start;
    /**
     * Gets the month name based on the current locale and in the format selected
     *
     * @param month - the month as a number (0-11)
     * @param format - the format it should be returned in ("short" | "long")
     * @returns string containing the month name
     */
    private getMonthName;
    /**
     * Generates the weekday labels based on the current locale and configured
     * first day of the week populating this.weekDays
     *
     * @param format - The weekday display format ('narrow', 'short', or 'long').
     */
    private generateWeekDays;
    /**
     * Gets the day of the week name from the day number in <abbr> tag
     *
     * @param month - the month as a number (0-6)
     * @param format - the format it should be returned in ("narrow" | "short" | "long")
     * @returns string containing the day name
     */
    private getWeekDay;
    private daysInMonth;
    private updateMonthLabel;
    private updateMonth;
    private updateYearLabel;
    updateYear(change: number): void;
    private updateDate;
    private parseDateString;
    private watchInput;
    private setDateString;
    setDate(date: Date): void;
    private getRegionFromLocale;
    /**
     * Sets the locale for the calendar which updates date style and language
     *
     * @param locale string with locale value ('en-GB')
     */
    private setLocale;
    private isOpen;
    show(): void;
    closeCalendar(): void;
    private toggleElements;
    restrictCharacters(field: HTMLInputElement, event: KeyboardEvent): boolean | undefined;
    formatDateInput(digits: string, format?: string): string;
    private generateDateInput;
    private applyMask;
    private generateYearPicker;
    private generateMonthPicker;
    generateDatePicker(): void;
}
export {};
