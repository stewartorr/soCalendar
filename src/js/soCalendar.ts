type TargetKind = 'date' | 'day' | 'month' | 'year';
type DayFormat = "narrow" | "short" | "long";
type MonthFormat = "short" | "long";

const targetMap: Record<string, TargetKind> = {
  socalendarTarget: 'date',
  socalendarTargetDay: 'day',
  socalendarTargetMonth: 'month',
  socalendarTargetYear: 'year'
};

interface SoCalendarOptions {
  locale?: string;
  minDate?: Date;
  maxDate?: Date;
  selector?: string;
  dateFormat?: string;
  firstDay?: number;
}

export default class SoCalendar {
  private dialog!: HTMLDialogElement;
  private content!: HTMLElement;
  private contentPrev!: HTMLElement;
  private contentCurrent!: HTMLElement;
  private contentNext!: HTMLElement;
  private monthLabel!: HTMLButtonElement;
  private yearLabel!: HTMLButtonElement;
  private todayBtn!: HTMLButtonElement;
  private prevMonthBtn!: HTMLButtonElement;
  private nextMonthBtn!: HTMLButtonElement;
  private prevYearBtn!: HTMLButtonElement;
  private nextYearBtn!: HTMLButtonElement;
  private backBtn!: HTMLButtonElement;
  private editBtn!: HTMLButtonElement;
  private cancelBtn!: HTMLButtonElement;
  private confirmBtn!: HTMLButtonElement;
  private targetElement!: HTMLInputElement

  private iconPreviousMonth: string = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path></svg>`;
  private iconNextMonth: string = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path></svg>`;
  private iconPreviousYear: string = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M197.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L123.31,128ZM72,40a8,8,0,0,0-8,8V208a8,8,0,0,0,16,0V48A8,8,0,0,0,72,40Z"></path></svg>`;
  private iconNextYear: string = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M149.66,122.34a8,8,0,0,1,0,11.32l-80,80a8,8,0,0,1-11.32-11.32L132.69,128,58.34,53.66A8,8,0,0,1,69.66,42.34ZM184,40a8,8,0,0,0-8,8V208a8,8,0,0,0,16,0V48A8,8,0,0,0,184,40Z"></path></svg>`;
  private iconEdit: string = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path></svg>`;
  private iconBack: string = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>`;
  private iconToday: string = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-64-56a16,16,0,1,1-16-16A16,16,0,0,1,144,152Z"></path></svg>`;
  private iconCancel: string = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>`;
  private iconConfirm: string = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>`;
  private iconPreviousDecade: string = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M176,128a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,128Zm56,0A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>`;
  private iconNextDecade: string = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"></path></svg>`;

  private locale!: string;
  private date: Date = new Date();
  private today: Date = new Date();
  private referenceDate: Date = new Date(1970, 0, 4);
  private minDate!: Date | false;
  private maxDate!: Date | false;
  private weekDays!: [string, string][];
  private year: number = new Date().getFullYear();
  private month: number = new Date().getMonth();
  private day: number = new Date().getDay();
  private selector: string = '.date-picker';
  private dateFormat!: string;
  private firstDay?: number;
  private dateRestrictions: RegExp = /^[0-9/-]+$/;

  private static shared: SoCalendar | null = null;
  private readonly perTarget = new WeakMap<HTMLInputElement, Partial<SoCalendarOptions>>();
  private readonly defaults!: Readonly<Required<SoCalendarOptions>>;

  private static readonly DEFAULTS: Required<SoCalendarOptions> = {
    selector: '.date-picker',
    locale: navigator.languages?.[0] || navigator.language || "en-EN",
    minDate: undefined as unknown as Date,
    maxDate: undefined as unknown as Date,
    dateFormat: 'DD/MM/YYYY',
    firstDay: 1
  };

  constructor() {
    if (SoCalendar.shared) {
      return SoCalendar.shared;
    }

    const config = { ...SoCalendar.DEFAULTS};
    this.defaults = Object.freeze(config);
    Object.assign(this, config);

    SoCalendar.shared = this;
    this.start();
  }

  /**
   * Gets config values for soCalendar Input
   * @param target - the HTMLInputElement that contains the options
   * @returns object containing key/value results
   */
  private configFor(target: HTMLInputElement): Required<SoCalendarOptions> {
    const overrides = this.perTarget.get(target) ?? {};
    return { ...this.defaults, ...overrides };
  }

  /**
   * 
   * @param selector (string) containing the selector - defaults to `.date-picker`
   * @param options (SoCalendarOptions) containing any overrides for the options
   */
  public init(selector: string = this.defaults.selector, options: SoCalendarOptions = {}) {
    const targetElements = document.querySelectorAll<HTMLInputElement>(selector);

    if (options.minDate instanceof Date) options.minDate.setHours(0, 0, 0, 0);
    if (options.maxDate instanceof Date) options.maxDate.setHours(0, 0, 0, 0);    // Validate set options
    if (options.dateFormat) this.dateFormat = options.dateFormat;
    
    targetElements.forEach((element) => {

      // Save target element options
      const { selector: _s, ...rest } = options;
      this.perTarget.set(element, rest);

      // If element is a button, check for target inputs and add masks to inputs
      if (element instanceof HTMLButtonElement) {
        Object.entries(element.dataset).forEach(([key, value]) => {
          if (!value) return;
          const type = targetMap[key];
          if (type !== undefined) {
            const target = document.getElementById(value);
            if (target && target instanceof HTMLInputElement) {
              this.watchInput(target, type);
            } else {
              console.log(`[soCalendar] Target element cannot be found "#${value}".`);
            }
          }
        });
      } else if (element instanceof HTMLInputElement) {
        // Add watcher to element
        this.watchInput(element, 'date');
      }

      //////////////////////////////////////////////////////////////////////////
      // TODO: Here I need to detect date parts :/
      //////////////////////////////////////////////////////////////////////////

      element.addEventListener('click', (event) => {
        const element = event.currentTarget as HTMLInputElement | HTMLButtonElement;
        if (element instanceof HTMLButtonElement && element.dataset.socalendarTarget) {
          const target = document.getElementById(element.dataset.socalendarTarget);
          if (target instanceof HTMLInputElement) {
            target.classList.add('socalendar-target');
            this.targetElement = target;
          } else {
            console.log(`[soCalendar] Target element with id "${element.dataset.socalendarTarget}" not found or not an input`);
          }
        } else if (element instanceof HTMLInputElement) {
          element.classList.add('socalendar-target');
          this.targetElement = element;
        } else {
          console.log(`[soCalendar] Button element missing data-socalendar-target attribute for target element.`);
          return;
        }

        const cfg = this.configFor(this.targetElement);
        this.locale = cfg.locale;
        this.dateFormat = cfg.dateFormat;
        this.firstDay = cfg.firstDay;
        this.minDate = cfg.minDate instanceof Date ? cfg.minDate : false;
        this.maxDate = cfg.maxDate instanceof Date ? cfg.maxDate : false;

        // Check target to see if `data-min-date` is set
        if (!(this.minDate instanceof Date)) {
          if (this.targetElement.dataset.minDate) {
              this.minDate = this.parseDateString(this.targetElement.dataset.minDate);
          } else {
            this.minDate = false;
          }
        }

        // Check target to see if `data-max-date` is set
        if (!(this.maxDate instanceof Date)) {
          if (this.targetElement.dataset.maxDate) {
            this.maxDate = this.parseDateString(this.targetElement.dataset.maxDate);
          } else {
            this.maxDate = false;
          }
        }

        // If `data-date-format` is set, try and set locale
        if (this.targetElement.dataset.dateFormat) {
          this.dateFormat = this.targetElement.dataset.dateFormat;
        }

        // If `data-locale` is set, try and set locale
        if (this.targetElement.dataset.locale) {
          this.setLocale(this.targetElement.dataset.locale);
        } else {
          this.setLocale(this.locale);
        }

        // Work out the date they have selected already and update our date
        if (this.targetElement.type === 'date' && this.targetElement.value.trim() != '') {
          this.date = new Date(this.targetElement.value);
        } else {
          // TODO : ADD MASK
          if (!this.setDateString(this.targetElement.value)) {
            this.date = this.today;
          }
        }

        this.year = this.date.getFullYear();
        this.month = this.date.getMonth();
        this.day = this.date.getDate();
        this.generateDatePicker();
        this.updateMonthLabel();
        this.updateYearLabel();
        this.showCalendar();
      });
    });
  }

  private start() {
    const existing = document.getElementById("soCalendar");
    if (existing instanceof HTMLDialogElement) {
      this.dialog = existing;
    } else {
      const dialog = document.createElement('dialog');
      dialog.addEventListener("close", (event) => {
        this.closeCalendar();
      })
      dialog.id = "soCalendar";
      dialog.classList.add('socalendar');
      dialog.dataset.socalendarView = 'date';
      dialog.innerHTML = `
        <div class="socalendar-inner">
          <div class="socalendar-row">
            <div class="socalendar-label-prev">
              <button id="soCalendar-back" class="socalendar-button socalendar-back" type="button">${this.iconBack}</button>
              <button id="soCalendar-prev-year" class="socalendar-button socalendar-prev-year" type="button">${this.iconPreviousYear}</button>
              <button id="soCalendar-prev-month" class="socalendar-button socalendar-prev-month" type="button">${this.iconPreviousMonth}</button>
            </div>
            <div class="socalendar-label">
              <button id="soCalendar-label-month" class="socalendar-button-label socalendar-label-month" type="button">
                <span data-before="${this.getMonthName(this.date.getMonth()-1, "short")}" data-after="${this.getMonthName(this.date.getMonth()+1, "short")}">${this.getMonthName(this.date.getMonth(), "short")}</span>
              </button>
              <button id="soCalendar-label-year" class="socalendar-button-label socalendar-label-year" type="button">
                <span data-before="${this.year-1}" data-after="${this.year+1}">${this.year}</span>
              </button>
              </div>
              <div class="socalendar-label-next">
              <button id="soCalendar-edit" class="socalendar-button socalendar-edit" type="button">${this.iconEdit}</button>
              <button id="soCalendar-next-month" class="socalendar-button socalendar-next-month" type="button">${this.iconNextMonth}</button>
              <button id="soCalendar-next-year" class="socalendar-button socalendar-next-year" type="button">${this.iconNextYear}</button>
            </div>
          </div>
          <div class="socalendar-content-wrapper">
            <div id="soCalendar-content" class="socalendar-content-inner" aria-live="polite">
              <div id="soCalendar-content-prev" class="socalendar-content"></div>
              <div id="soCalendar-content-current" class="socalendar-content"></div>
              <div id="soCalendar-content-next" class="socalendar-content"></div>
            </div>
          </div>
          <div id="soCalendar-footer" class="socalendar-row">
            <button id="soCalendar-cancel" class="socalendar-button socalendar-cancel" type="button">${this.iconCancel}</button>
            <button id="soCalendar-today" class="socalendar-button socalendar-today" type="button" disabled>${this.iconToday}</button>
            <button id="soCalendar-confirm" class="socalendar-button socalendar-confirm" type="button">${this.iconConfirm}</button>
          </div>
        </div>`;
      document.body.appendChild(dialog);
      this.dialog = dialog;
      this.content = dialog.querySelector("#soCalendar-content")!;
      this.contentPrev = dialog.querySelector("#soCalendar-content-prev")!;
      this.contentCurrent = dialog.querySelector("#soCalendar-content-current")!;
      this.contentNext = dialog.querySelector("#soCalendar-content-next")!;
      this.monthLabel = dialog.querySelector("#soCalendar-label-month")!;
      this.yearLabel = dialog.querySelector("#soCalendar-label-year")!;
      this.todayBtn = dialog.querySelector("#soCalendar-today")!;
      this.prevMonthBtn = dialog.querySelector("#soCalendar-prev-month")!;
      this.nextMonthBtn = dialog.querySelector("#soCalendar-next-month")!;
      this.prevYearBtn = dialog.querySelector("#soCalendar-prev-year")!;
      this.nextYearBtn = dialog.querySelector("#soCalendar-next-year")!;
      this.backBtn = dialog.querySelector("#soCalendar-back")!;
      this.editBtn = dialog.querySelector("#soCalendar-edit")!;
      this.cancelBtn = dialog.querySelector("#soCalendar-cancel")!;
      this.confirmBtn = dialog.querySelector("#soCalendar-confirm")!;
    
      // Detect click outside date picker and close
      this.dialog.addEventListener('mousedown', (event) => {
        const rect = this.dialog.getBoundingClientRect();

        const isInDialog =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;

        if (!isInDialog) {
          this.closeCalendar();
        }
      });

      // Transitions
      this.content.addEventListener('transitionend', (e) => {
        if (e.target !== this.content) return;
        this.content.classList.remove('next', 'prev');
        this.generateDatePicker();
      }, );

      // Trigger animation for month label
      this.monthLabel.addEventListener('transitionend', () => {
        this.monthLabel.classList.remove('next', 'prev');
        this.updateMonthLabel();
      });

      // Trigger animation for month label
      this.yearLabel.addEventListener('transitionend', () => {
        this.yearLabel.classList.remove('next', 'prev');
        this.updateYearLabel()
      });

      // Back button show when picking a month or year
      this.backBtn.addEventListener('click', () => {
        this.generateDatePicker();
      });
      
      // When click to edit date, show date input
      this.editBtn.addEventListener('click', () => {
        this.generateDateInput();
      });
      
      // Go to previous year
      this.prevYearBtn.addEventListener('click', () => { 
        this.updateYear(-1) 
      });
      
      // Go to previous month
      this.prevMonthBtn.addEventListener('click', () => { 
        this.updateMonth(-1) 
      });
      
      // Go to next month
      this.nextMonthBtn.addEventListener('click', () => { 
        this.updateMonth(1) 
      });
      
      // Go to next year
      this.nextYearBtn.addEventListener('click', () => { 
        this.updateYear(1); 
      });
      
      // Close calendar
      this.cancelBtn.addEventListener('click', () => { 
        this.closeCalendar() 
      });
      
      // Confirm calendar selection TODO
      this.confirmBtn.addEventListener('click', () => { 
        this.closeCalendar() 
      });
      
      // Update calendar picker to today
      this.todayBtn.addEventListener('click', () => {
        // TODO, this needs to transition...
        this.year = this.today.getFullYear();
        this.month = this.today.getMonth();
        this.day = this.today.getDate(); 
        this.updateYearLabel();
        this.updateMonthLabel();
        this.generateDatePicker();
      });
      
      // Open month picker
      this.monthLabel.addEventListener('click', () => { 
        this.generateMonthPicker();
      });
      
      // Open year picker
      this.yearLabel.addEventListener('click', () => {
        this.generateYearPicker();
      });
    }
  }

  /**
   * Gets the month name based on the current locale and in the format selected
   * 
   * @param month - the month as a number (0-11)
   * @param format - the format it should be returned in ("short" | "long")
   * @returns string containing the month name
   */
	private getMonthName(month: number, format: MonthFormat = 'short'): string {
		return new Intl.DateTimeFormat(this.locale, {
			month: format,
		}).format(new Date(2000, month, 1));
	}

  /**
   * Generates the weekday labels based on the current locale and configured 
   * first day of the week populating this.weekDays
   *
   * @param format - The weekday display format ('narrow', 'short', or 'long').
   */
  private generateWeekDays(format: DayFormat = 'narrow'): void {
    this.weekDays = [];
    const firstDay = this.firstDay ?? this.defaults.firstDay;
    const jsFirstDay = firstDay === 7 ? 0 : firstDay;
    for (let i = 0; i < 7; i++) {
      const dayOffset = (jsFirstDay + i) % 7;
      const date = new Date(this.referenceDate);
      date.setDate(this.referenceDate.getDate() + dayOffset);
      this.weekDays.push([
        new Intl.DateTimeFormat(this.locale, { weekday: format }).format(date),
        new Intl.DateTimeFormat(this.locale, { weekday: 'long' }).format(date)
      ]);
    }
  }

  /**
   * Gets the day of the week name from the day number in <abbr> tag
   * 
   * @param day - the day of the week as a number (0-6)
   * @returns string containing the day name
   */
  private getWeekDay(day: number): string {
    const [label, full] = this.weekDays[day];
    return `<abbr title="${full}">${label}</abbr>`;
  }

  private daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  private updateMonthLabel() {
    if (this.monthLabel instanceof HTMLButtonElement) this.monthLabel.innerHTML = `<span 
      data-before="${this.getMonthName(this.month-1, "short")}" 
      data-after="${this.getMonthName(this.month+1, "short")}">
        ${this.getMonthName(this.month, "short")}
      </span>`;
  }

  private updateMonth(change: number): void {
    const newDate = new Date(this.year, this.month + change, this.day);
    const classToggle = change > 0 ? 'next' : 'prev' ;
    if (this.minDate instanceof Date && newDate < this.minDate || this.maxDate instanceof Date && newDate > this.maxDate) {
      return;
    }
    
    if (this.month + change < 0) {
      this.month = 11;
      this.updateYear(-1);
    } else if (this.month + change > 11) {
      this.month = 0;
      this.updateYear(1);
    } else {
      this.month += change;
    }
    this.content.classList.add(classToggle);
    this.monthLabel.classList.add(classToggle);
  }

  private updateYearLabel() {
    if (this.yearLabel instanceof HTMLButtonElement) this.yearLabel.innerHTML = `<span data-before="${this.year-1}" data-after="${this.year+1}">${this.year}</span>`;
  }

  updateYear(change: number): void {
    const classToggle = change > 0 ? 'next' : 'prev' ;
    const newDate = new Date(this.year + change, this.month, this.day);
    if (this.minDate instanceof Date && newDate < this.minDate || this.maxDate instanceof Date && newDate > this.maxDate) {
      return;
    }
    this.content.classList.add(classToggle);
    this.generateDatePicker('year');
    this.yearLabel.classList.add(classToggle);
    this.content.classList.add(classToggle);
    this.year += change;
  }

  private updateDate() {
    // Check if date is today and toggle today button
    this.todayBtn.disabled = !(this.year != this.today.getFullYear() ||  this.month != this.today.getMonth());

    // Check prev/next buttons to see if they are within minDate/maxDate
    const min = this.minDate instanceof Date ? this.minDate : null;
    const max = this.maxDate instanceof Date ? this.maxDate : null;

    const prevMonthTarget = new Date(this.year, this.month, 0); // Last day of prev month
    const nextMonthTarget = new Date(this.year, this.month + 1, 1); // First day of next month
    const prevYearTarget  = new Date(this.year - 1, this.month, 1);
    const nextYearTarget  = new Date(this.year + 1, this.month, 1);

    this.prevMonthBtn.disabled = !!min && prevMonthTarget < this.minDate;
    this.nextMonthBtn.disabled = !!max && nextMonthTarget > this.maxDate;
    this.prevYearBtn.disabled  = !!min && prevYearTarget < this.minDate;
    this.nextYearBtn.disabled  = !!max && nextYearTarget > this.maxDate;
  }

  private parseDateString(value: string): Date | false {
    if (!value) return false;

    // Normalize separator (allow / or -)
    const parts = value.split(/[\/\-]/);

    if (parts.length !== 3) return false;

    let day: number;
    let month: number;
    let year: number;

    switch (this.dateFormat) {
      case "DD/MM/YYYY":
        day = Number(parts[0]);
        month = Number(parts[1]);
        year = Number(parts[2]);
        break;

      case "MM/DD/YYYY":
        month = Number(parts[0]);
        day = Number(parts[1]);
        year = Number(parts[2]);
        break;

      case "YYYY/MM/DD":
        year = Number(parts[0]);
        month = Number(parts[1]);
        day = Number(parts[2]);
        break;

      default:
        return false;
    }

    // Basic numeric validation
    if (
      !Number.isInteger(day) ||
      !Number.isInteger(month) ||
      !Number.isInteger(year)
    ) {
      return false;
    }

    // Basic range checks
    if (year < 1000 || year > 9999) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    // Create date
    const date = new Date(year, month - 1, day);

    // Strict validation (prevents rollover issues)
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return false;
    }
    return date;
  }

  /**
   * Prepare and watch an input to restrict character input and add relevant 
   * attributes to make it easier to use.
   * 
   * @param target - element it should be applied to 
   * @param type - what kind of input type is it to change the behaviour
   */
  private watchInput(target: HTMLInputElement, type: TargetKind = 'date'): void {
    if (target instanceof HTMLInputElement ) {
      target.inputMode = 'numeric';
      target.readOnly = true;
      target.type = 'text';
      if (type !== 'date') {
        switch (type) {
          case 'day':
          case 'month':
            target.maxLength = 2;
            target.pattern = '[0-9]{2}';
            break;
          case 'year':
            target.maxLength = 4;
            target.pattern = '[0-9]{4}';
            break;
        }
      } else {
        // This is a full date field based on `this.dateFormat`
        target.maxLength = this.dateFormat.length;
        target.placeholder = this.dateFormat;
        // Simple and strict for your three supported formats
        switch (this.dateFormat) {
          case 'DD/MM/YYYY':
          case 'MM/DD/YYYY':
            target.pattern = '^\\d{2}[\\/\\-]\\d{2}[\\/\\-]\\d{4}$';
            break;
          case 'YYYY/MM/DD':
            target.pattern = '^\\d{4}[\\/\\-]\\d{2}[\\/\\-]\\d{2}$';
            break;
          default:
            // digits plus / or -
            target.pattern = '^[-0-9/]+$'; // or '^[0-9/-]+$'
            break;
        }
      }

      // Apply mask for `date` type
      if (type === 'date') {
        target.addEventListener('input', (e) => this.applyMask(e));
        target.addEventListener('paste', (e) => this.applyMask(e));
      }
      
      // Restrict character input 
      target.addEventListener('keydown', (event: KeyboardEvent) => {
        this.restrictCharacters(target, event);
      });
    }
  }

  /**
   * Set the date based on a string value if it is valid
   * @param value string containg a date in the format set in `this.dateFormat`
   * @returns date or false
   */
  private setDateString(value: string): boolean {
    const currentDate = this.parseDateString(value.trim());
    if (currentDate instanceof Date) {
      this.date = currentDate;
      return true
    }
    return false;
  }

  /**
   * Sets the date selected by the user and sets the input value to that date in
   * the format set in `this.dateFormat`
   * @param date - the date the user selected
   */
  public setDate(date: Date): void {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    if (this.targetElement.type === 'date') {
      this.targetElement.value = `${yyyy}-${mm}-${dd}`;
    } else {
      switch (this.dateFormat) {
        case "DD/MM/YYYY":
          this.targetElement.value = `${dd}/${mm}/${yyyy}`;
          break;
        case "MM/DD/YYYY":
          this.targetElement.value = `${mm}/${dd}/${yyyy}`;
          break;
        default:
          this.targetElement.value = `${yyyy}/${mm}/${dd}`;
          break;
      }
    }
    this.closeCalendar();
  }

  /**
   * Extracts the region from the locale string
   * @param locale string
   * @returns string - the region as uppercase letters
   */
  private getRegionFromLocale(locale: string): string {
    const parts = locale.split("-");
    const region = parts.length >= 2 ? parts[1] : "";
    return region.toUpperCase();
  }

  /**
   * Sets the locale for the calendar which updates date style and language
   * 
   * @param locale string with locale value ('en-GB')
   */
  private setLocale(locale: string | null = null): void {
    if (locale && Intl.DateTimeFormat.supportedLocalesOf([locale]).length > 0) {
      try {
        const loc = new Intl.Locale(locale) as any;
        const weekInfo = loc.getWeekInfo();
        this.firstDay = weekInfo.firstDay;
      } catch {
        const region = this.getRegionFromLocale(locale);
        // Sunday-first is common in the US and a handful of places
        const SUNDAY_FIRST = new Set([
          "US", // United States
          "CA", // Canada (commonly Sunday-first in many calendars)
          "PH", // Philippines
          "MX", // Mexico (often Sunday-first)
          "CO", // Colombia (often Sunday-first)
          "BR", // Brazil (often Sunday-first)
          "AU", // Australia (mixed; many calendars show Monday, but Sunday is also common)
          "NZ", // New Zealand (mixed)
          "JP", // Japan (often Sunday-first)
          "KR", // Korea (often Sunday-first)
          "TW", // Taiwan
          "HK", // Hong Kong
        ]);

        // Fallback detection
        if (SUNDAY_FIRST.has(region) || locale.toLowerCase().startsWith("en-us")) {
          this.firstDay = 7;
        } else {
          // If not able to detect, use the default
          this.firstDay = SoCalendar.DEFAULTS.firstDay;
        }
      }
      this.locale = locale;
    } else {
      if (locale) console.log(`[soCalendar] Cannot change locale as invalid value "${locale}".`);
      this.locale = SoCalendar.DEFAULTS.locale;
    }
    this.generateWeekDays();
  }

  private isOpen(): boolean {
    return (this.dialog && document.body.classList.contains('socalendar-open'));
  }
  
  public showCalendar(): void {
    if (this.isOpen()) return;
    document.body.classList.add('socalendar-open')
    this.dialog.showModal();
  }
  
  public closeCalendar(): void {
    document.body.classList.remove('socalendar-open')
    this.dialog.close();
  }

  private toggleElements(ids: string[], hide: boolean = false, cssclass: string = 'socalendar-hidden'): void {
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) element.classList.toggle(cssclass, hide);
    });
  }

  restrictCharacters(
      field: HTMLInputElement,
      event: KeyboardEvent
    ) {
      const ignoreKeys = [
        'ArrowRight',
        'ArrowLeft',
        'ArrowUp',
        'ArrowDown',
        'Backspace',
        'Delete',
        'Tab',
        'Insert',
        'Home',
        'End',
        'PageUp',
        'PageDown',
      ];

      // Ignore the usual keys (Some things to consider altKey, ctrlKey, metaKey or shiftKey)
      if ((event.key && ignoreKeys.includes(event.key)) || event.ctrlKey || event.metaKey)
        return true;

      // if they pressed esc... remove focus from field...
      if (event.key === 'Escape') {
        field.blur();
        return false;
      }

      if (!event.key.match(this.dateRestrictions)) {
        event.preventDefault();
        return false;
      }
    }

  formatDateInput(digits: string, format = "dd/MM/yyyy") {
    const parts = {
      dd: digits.slice(0, 2),
      MM: digits.slice(2, 4),
      yyyy: digits.slice(4, 8),
    };

    return format
      .replace("dd", parts.dd || "")
      .replace("MM", parts.MM || "")
      .replace("yyyy", parts.yyyy || "")
      .replace(/\/+/g, (match, offset) => {
        // remove trailing separators
        return offset < digits.length ? match : "";
      });
  }

  /**
   * Generate date input field for the customer to enter their own date with
   * an input mask to make it easier
   */
  private generateDateInput(): void {
    this.toggleElements(['soCalendar-back'], false);
    this.toggleElements(['soCalendar-edit'], true);
    this.contentCurrent.innerHTML = `
      <div class="socalendar-date-editor socalendar-row">
        <input class="socalendar-input" id="soCalendar-input" type="text" inputmode="numeric" pattern="[0-9]{4}" maxlength="10" placeholder="${this.dateFormat}" mask="${this.getMaskPattern()}" />
        <button type="button" disabled id="soCalendar-date-confirm" class="socalendar-input-button ">${this.iconConfirm}</button>
      </div>
    `;
    
    // Watch the date input field - restrict characters and ask input mask
    const dateInput = document.getElementById("soCalendar-input") as HTMLInputElement;
    const dateConfirm = document.getElementById("soCalendar-date-confirm") as HTMLButtonElement;

    if (dateInput instanceof HTMLInputElement) {
      dateInput.focus();
      dateInput.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          event.preventDefault();
          if (event.target instanceof HTMLInputElement && event.target.getAttribute('mask') && event.target.getAttribute('mask')!.length === event.target.value.length) {
            this.setDateString(event.target.value);
            this.year = this.date.getFullYear();
            this.month = this.date.getMonth();
            this.day = this.date.getDate();
            this.generateDatePicker();
            this.updateMonthLabel();
            this.updateYearLabel();
          }
        }
        this.restrictCharacters(dateInput, event);
      });
      dateInput.addEventListener('input', (e) => this.applyMask(e));
      dateInput.addEventListener('paste', (e) => this.applyMask(e));
    }

    dateConfirm.addEventListener('click', (event: MouseEvent) => {
      this.setDateString(dateInput.value);
      this.year = this.date.getFullYear();
      this.month = this.date.getMonth();
      this.day = this.date.getDate();
      this.generateDatePicker();
      this.updateMonthLabel();
      this.updateYearLabel();
    });
  }

  private getMaskPattern(): string {
    return this.dateFormat === 'YYYY/MM/DD' ? "0000/00/00" : "00/00/0000";
  }

  private applyMask = (event: Event): void => {
    const confirm = document.getElementById('soCalendar-date-confirm');
    const target = event.target;
    const maskPattern = this.getMaskPattern();

    if (!(target instanceof HTMLInputElement)) return;

    const value = target.value;
    const pureValue = value.replace(/\D/g, '');

    if (value.trim() === '') return;
    
    let maskedValue = '';
    let cursorPos = target.selectionStart || 0;
    let valueIdx = 0;
    
    for (let i = 0; i < maskPattern.length; i++) {
      if (valueIdx >= pureValue.length) break;

      const inputChar = pureValue[valueIdx];
      if (maskPattern[i] !== '0' && maskPattern[i] !== 'A') {
        maskedValue += maskPattern[i]
        continue
      }

      if (maskPattern[i] === '0' && !/\d/.test(inputChar)) break;
      if (maskPattern[i] === 'A' && !/[a-zA-Z]/.test(inputChar)) break;

      maskedValue += pureValue[valueIdx++]

      let nextChar = maskPattern[i + 1]

      if (nextChar && nextChar !== '0' && nextChar !== 'A') {
        maskedValue += nextChar
        i++
      }
    }
    target.value = maskedValue;
    let inCursorPos = maskedValue[cursorPos - 1]

    if (maskPattern[cursorPos] != '0' && maskPattern[cursorPos] != 'A') {
      cursorPos++;
    }

    if (maskedValue.length > cursorPos) {
      while (!/\d/.test(inCursorPos) && !/[a-zA-Z]/.test(inCursorPos)) {
        inCursorPos = maskedValue[cursorPos - 1];
        cursorPos++;
      }
    }

    target.setSelectionRange(cursorPos, cursorPos);
    if (confirm instanceof HTMLButtonElement) confirm.disabled = maskedValue.length !== maskPattern.length;
  }

  private generateYearPicker(year?: number | null): void {
    if (!year) year = this.year;

    // Set the view and tidy up classes
    this.dialog.dataset.socalendarView = 'year';
    this.content.classList.remove('next', 'prev');

    this.toggleElements(['soCalendar-back', 'soCalendar-edit'], false);
    this.toggleElements(['soCalendar-footer', 
      'soCalendar-content-month',
      'soCalendar-prev-year',
      'soCalendar-prev-month',
      'soCalendar-next-month',
      'soCalendar-next-year'
    ], true);    

    // Clear the other content areas
    this.contentPrev.innerHTML = '';
    this.contentNext.innerHTML = '';

    let yearPickerHTML: string = '';

    // TODO, disabled outside min and max

    const decadeStart = Math.floor(year / 10) * 10;
    for (let offset = -1; offset <= 1; offset++) {
      const thisDecade = decadeStart + (10 * offset);
      yearPickerHTML += `
        <ol class="socalendar-year-picker">
          ${Array.from({ length: 10 }, (_, i) => {
            const year = thisDecade + i;
            return `
              <li>
                <button type="button" class="socalendar-button ${this.year === year?"selected":""} socalendar-select-year" data-year="${year}">
                  ${year}
                </button>
              </li>
            `;
          }).join("")}
        </ol>
      `;
    }
    this.contentCurrent.innerHTML = `
      <div class="socalendar-year-picker-container">
        <div class="socalendar-year-picker-scroller socalendar-row">
          <button type="button" id="soCalendar-decade-prev">${this.iconPreviousDecade}</button>
          <span class="socalendar-year-picker-label" id="soCalendar-year-picker-label">
            <span class="year-value">${decadeStart}</span> 
            <svg class="separator" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path></svg>
            <span class="year-value">${decadeStart+9}</span>
          </span>
          <button type="button" id="soCalendar-decade-next">${this.iconNextDecade}</button>
        </div>
        <div class="socalendar-year-picker-wrapper">
          <div class="socalendar-year-picker-inner" id="soCalendar-year-picker-inner">
            ${yearPickerHTML}
          </div>
        </div>
      </div>
    `;

    const yearPickerInner = document.getElementById('soCalendar-year-picker-inner')!;
    const prevDecade = document.getElementById('soCalendar-decade-prev')!;
    const nextDecade = document.getElementById('soCalendar-decade-next')!;

    prevDecade.addEventListener('click', () => {
      yearPickerInner.addEventListener('transitionend', () => {
        yearPickerInner.classList.remove('next', 'prev');
        this.year-=10;
        this.generateYearPicker(decadeStart - 10);
      });
      yearPickerInner.classList.add('prev');
    }, { once: true });
  
    nextDecade.addEventListener('click', () => {
      yearPickerInner.addEventListener('transitionend', () => {
        yearPickerInner.classList.remove('next', 'prev');
        this.year+=10;
        this.generateYearPicker(decadeStart + 10);
      });
      yearPickerInner.classList.add('next');
    }, { once: true });
    
    // Add button event listeners
    const calendarButtons = this.dialog.querySelectorAll<HTMLButtonElement>("#soCalendar button.socalendar-select-year");
    calendarButtons.forEach((b) => {
      b.addEventListener('click', (event) => {
        const button = event.currentTarget;
        if (button instanceof HTMLButtonElement) {
          const year = Number(button.dataset.year);
          if (year) {
            this.year = year;
            this.updateYearLabel();
            this.generateMonthPicker();
          }
        }
      });
    });
  }

  // This updates the main calendar content area to show month picker
  private generateMonthPicker():void {

    // Set the view and tidy up classes
    this.dialog.dataset.socalendarView = 'month';
    this.content.classList.remove('next', 'prev');

    this.toggleElements(['soCalendar-back', 'soCalendar-edit'], false);
    this.toggleElements(['soCalendar-footer', 
      'soCalendar-prev-year',
      'soCalendar-prev-month',
      'soCalendar-next-month',
      'soCalendar-next-year'
    ], true);
    
    this.contentCurrent.innerHTML = `<ol class="socalendar-month-picker">
      ${[0,1,2,3,4,5,6,7,8,9,10,11]
      .map(i => `
        <li>
          <button type="button" class="socalendar-button soCalendar-select-month" data-month="${i}">
            ${this.getMonthName(i, 'long')}
          </button>
        </li>
      `).join("")}
    </ol>
    `;

    // Add button event listeners
    const calendarButtons = this.dialog.querySelectorAll<HTMLButtonElement>("#soCalendar button.soCalendar-select-month");
    calendarButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const button = event.currentTarget;
        if (button instanceof HTMLButtonElement) {
          const month = Number(button.dataset.month);
          if (!Number.isNaN(month)) {
            this.month = month;
            this.updateMonthLabel();
            this.generateDatePicker();
          }
        }
      });
    });
  }

  // Generate a datepicker which contains previous, current and next month for scrolling
	generateDatePicker(period: 'month' | 'year' = 'month'): void {

    // Set the view and tidy up classes
    this.dialog.dataset.socalendarView = 'date';
    this.content.classList.remove('next', 'prev');

    this.toggleElements(['soCalendar-back', 'soCalendar-edit'], true);
    this.toggleElements([
      'soCalendar-footer', 
      'soCalendar-prev-year',
      'soCalendar-prev-month',
      'soCalendar-next-month',
      'soCalendar-next-year'
    ], false);

    const todayY = this.today.getFullYear();
    const todayM = this.today.getMonth();
    const todayD = this.today.getDate();

    const targets: HTMLElement[] = [this.contentPrev, this.contentCurrent, this.contentNext];

    for (let offset = -1; offset <= 1; offset++) {

      // Compute correct month/year for this iteration
      const baseDate = (period === 'year') ? new Date(this.year + offset, this.month, 1) : new Date(this.year, this.month + offset, 1);
      const viewYear = baseDate.getFullYear();
      const viewMonth = baseDate.getMonth();

      const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
      const monthDays = this.daysInMonth(viewYear, viewMonth);

      let startDay = firstDayOfMonth.getDay();
      if (this.firstDay === 1) startDay = (startDay + 6) % 7;

      const prevMonthDate = new Date(viewYear, viewMonth - 1, 1);
      const prevMonth = prevMonthDate.getMonth();
      const prevYear = prevMonthDate.getFullYear();
      const prevMonthDays = this.daysInMonth(prevYear, prevMonth);

      const totalCells = 6 * 7;

      const days: {
        day: number;
        month: number;
        year: number;
        outside: boolean;
        isToday: boolean;
        isCurrent: boolean;
        isDisabled: boolean;
        isMinDate: boolean;
        isMaxDate: boolean;
      }[] = [];

      for (let i = 0; i < totalCells; i++) {
        let day: number;
        let month = viewMonth;
        let year = viewYear;
        let outside = false;

        if (i < startDay) {
          day = prevMonthDays - startDay + i + 1;
          month = prevMonth;
          year = prevYear;
          outside = true;

        } else if (i >= startDay + monthDays) {
          const nextMonthDate = new Date(viewYear, viewMonth + 1, 1);
          day = i - (startDay + monthDays) + 1;
          month = nextMonthDate.getMonth();
          year = nextMonthDate.getFullYear();
          outside = true;

        } else {
          day = i - startDay + 1;
        }

        const cellDate = new Date(year, month, day);

        // If the current cell is todays date, mark it as today
        const isToday = 
          !outside &&
          day === todayD &&
          month === todayM &&
          year === todayY;

        // If the current cell is this.date, mark it as current
        const isCurrent =
          this.date.getFullYear() === cellDate.getFullYear() &&
          this.date.getMonth() === cellDate.getMonth() &&
          this.date.getDate() === cellDate.getDate();

        const isDisabled = (this.minDate && new Date(year, month, day) < this.minDate || this.maxDate && new Date(year, month, day) > this.maxDate);
        
        const isMinDate = this.minDate instanceof Date && new Date(year, month, day).getTime() === this.minDate.getTime();
        const isMaxDate = this.maxDate instanceof Date && new Date(year, month, day).getTime() === this.maxDate.getTime();

        days.push({ day, month, year, outside, isToday, isCurrent, isDisabled, isMinDate, isMaxDate });
      }

      targets[offset + 1].innerHTML = `
        <table class="socalendar-date-picker" cellpadding="0" cellspacing="0">
          <caption class="socalendar-visually-hidden">
            ${this.getMonthName(viewMonth, "long")} ${viewYear}
          </caption>
          <tr>
            ${[0,1,2,3,4,5,6].map(i => `
              <th>${this.getWeekDay(i)}</th>
            `).join("")}
          </tr>
          ${[0,1,2,3,4,5].map(row =>
            `<tr>
              ${[0,1,2,3,4,5,6].map(col => {
                const cell = days[row * 7 + col];
                const label = `${cell.day} ${this.getMonthName(cell.month, "long")} ${cell.year}`;
                const classes = [
                  "socalendar-button",
                  "soCalendar-select-date",
                  cell.outside ? "is-outside-month" : "",
                  cell.isToday ? "is-today" : "",
                  cell.isCurrent ? "is-current" : "",
                  cell.isMinDate ? "is-min-date" : "",
                  cell.isMaxDate ? "is-max-date" : ""
                ].filter(Boolean).join(" ");

                return `
                  <td>
                    <button
                      aria-label="${label}"
                      type="button"
                      class="${classes}"
                      data-year="${cell.year}"
                      data-month="${cell.month}"
                      data-day="${cell.day}"
                      ${cell.isDisabled ? "disabled" : ""}
                    >
                      ${cell.day}
                    </button>
                  </td>
                `;
              }).join("")}
            </tr>`
          ).join("")}
        </table>
      `;
    }

    // Check elements based on new date
    if (period !== 'year') this.updateDate();

    // Add button event listeners
    const calendarButtons = this.dialog.querySelectorAll<HTMLButtonElement>("#soCalendar button.soCalendar-select-date");
    calendarButtons.forEach((b) => {
      b.addEventListener('click', (event) => {
        const button = event.currentTarget;
        if (button instanceof HTMLButtonElement) {
          const year = button.dataset.year;
          const month = button.dataset.month;
          const day = button.dataset.day;
          if (year && month && day) {
            this.setDate(new Date(Number(year), Number(month), Number(day)));
          }
        }
      });
    });
  }
}