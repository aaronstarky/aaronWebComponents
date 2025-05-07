class CalendarComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.selectedDay = null;
        this.keyDates = [];
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.render();
    }

    static get observedAttributes() {
        return ['key-dates'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'key-dates') {
            this.keyDates = newValue.split(',').map(date => new Date(date).toDateString());
            this.render();
        }
    }

    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                ${this.getStyles()}
            </style>
            <div class="calendar">
                <div class="calendar-controls">
                    <button class="calendar-btn" id="prev-month">
                        <svg id="month-backward" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-chevron-right h-4 w-4">
                            <path d="m9 18 6-6-6-6"></path>
                        </svg>
                    </button>
                    <h4 id="display-month">${this.getMonthName(this.currentMonth)}</h4>
                    <button class="calendar-btn" id="next-month">
                        <svg id="month-forward" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-chevron-right h-4 w-4">
                            <path d="m9 18 6-6-6-6"></path>
                        </svg>
                    </button>
                </div>
                <div class="calendar-body">
                    ${this.generateCalendarHTML()}
                </div>
            </div>
        `;

        this.shadowRoot.getElementById('prev-month').addEventListener('click', () => this.changeMonth(-1));
        this.shadowRoot.getElementById('next-month').addEventListener('click', () => this.changeMonth(1));
    }

    getMonthName(month) {
        return new Date(2025, month, 1).toLocaleString('default', { month: 'long' });
    }

    changeMonth(direction) {
        this.currentMonth += direction;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear -= 1;
        } else if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear += 1;
        }
        this.render();
    }

    generateCalendarHTML() {
        let daysHTML = '';
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const lastDate = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            daysHTML += `<div class="calendar-day not-day"></div>`;
        }

        for (let day = 1; day <= lastDate; day++) {
            const dateStr = new Date(this.currentYear, this.currentMonth, day).toDateString();
            const isKey = this.keyDates.includes(dateStr);
            daysHTML += `<button class="calendar-day ${isKey ? 'is-key' : ''}" data-date="${dateStr}">${day}</button>`;
        }

        return `<div class="calendar-header-item">Sun</div>
                <div class="calendar-header-item">Mon</div>
                <div class="calendar-header-item">Tue</div>
                <div class="calendar-header-item">Wed</div>
                <div class="calendar-header-item">Thu</div>
                <div class="calendar-header-item">Fri</div>
                <div class="calendar-header-item">Sat</div>
                ${daysHTML}`;
    }

    getStyles() {
        return `
            .calendar { display: flex; flex-direction: column; align-items: center; max-width: 500px; }
            .calendar-controls { display: flex; gap: 8px; align-items: center; justify-content: space-between; width: 100%; }
            .calendar-btn { all: unset; background-color: transparent; border-radius: 4px; border: solid 0.5px var(--item-border); cursor: pointer; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center; }
            #month-backward { transform: rotate(180deg); }
            .calendar-body { display: grid; grid-template-columns: repeat(7, 1fr); width: 100%; }
            .calendar-day { all: unset; display: flex; justify-content: center; align-items: center; width: 50px; height: 50px; border-radius: 4px; }
            .calendar-day:hover { background-color: #00369366; }
            .is-key { border: solid 2px #00215b; background-color: #00369331; color: #00215b; animation: twitch 1s infinite; }
            .calendar-day.not-day { background-color: transparent; }
            .calendar-day.is-key.selected, .calendar-day.selected { background-color: #00215b; color: white; animation: pulse 1s infinite; }
            @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(0.9); } 100% { transform: scale(1); } }
            @keyframes twitch { 0% { transform: rotate(0deg); } 25% { transform: rotate(5deg); } 50% { transform: rotate(0deg); } 75% { transform: rotate(-5deg); } 100% { transform: rotate(0deg); } }
        `;
    }
}

customElements.define('calendar-component', CalendarComponent);