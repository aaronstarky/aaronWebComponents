import { useState } from "react";
import type { Day } from "../../model/Day";
import { CalendarPresenter, type CalendarView } from "../../presenters/CalendarPresenter";
import { getCurrentMonth, getCurrentYear, mapMonthNumberToName } from "../../lib/DateUtils";
import { IconUtils } from "../../lib/IconUtils";
import "./Calendar.css";


interface CalendarProps {
    keyDates: string[];
    outputSelectedDate: (date: string) => void;
}

export default function Calendar(props: CalendarProps) {
    function UpdateSelectedDay(day: Day) {
        if (selectedDay) {
            let oldSelectedDay = selectedDay;
            oldSelectedDay.selected = false;
            setSelectedDay(oldSelectedDay);
        }
        day.selected = true;
        setSelectedDay(day);
        props.outputSelectedDate(day.date);
    }

    const [currentMonth, setCurrentMonth]: [number, (month: number) => void] = useState<number>(getCurrentMonth());
    const [currentYear, setCurrentYear]: [number, (year: number) => void] = useState<number>(getCurrentYear());
    const [selectedDay, setSelectedDay]: [Day | null, (day: Day) => void] = useState<Day | null>(null);
    const [displayMonth, setDisplayMonth]: [string, (month: string) => void] = useState<string>(mapMonthNumberToName(currentMonth));
    const [days, setDays]: [Day[], (days: Day[]) => void] = useState<Day[]>(CalendarPresenter.generateCalendar(new Date().getMonth(), new Date().getFullYear(), props.keyDates));

    const listener: CalendarView = {
        setCurrentMonth,
        setDisplayMonth,
        setDays,
        setSelectedDay,
        setCurrentYear
    }

    const presenter = new CalendarPresenter(listener);

    const nextMonth = () => {
        presenter.nextMonth(currentMonth, currentYear, props.keyDates);
    }

    const previousMonth = () => {
        presenter.previousMonth(currentMonth, currentYear, props.keyDates);
    }

    return (
        <div className="calendar">
            <div className="calendar-controls">
                <button
                    className="calendar-btn"
                    onClick={previousMonth}
                >
                    <img id="month-backward" src={IconUtils.getChevron()} alt="Next Month" />
                </button>
                <h4>{displayMonth}</h4>
                <button className="calendar-btn" onClick={nextMonth}>
                    <img id="month-forward" src={IconUtils.getChevron()} alt="Next Month" />
                </button>
            </div>
            <div className="calendar-body">
                <div className="calendar-header-item">Sun</div>
                <div className="calendar-header-item">Mon</div>
                <div className="calendar-header-item">Tue</div>
                <div className="calendar-header-item">Wed</div>
                <div className="calendar-header-item">Thu</div>
                <div className="calendar-header-item">Fri</div>
                <div className="calendar-header-item">Sat</div>
                {days.map((day, index) => (
                    <button
                        className={`calendar-day ${day.dayNumber === 0 ? 'not-day' : ''} ${day.isKey ? 'is-key' : ''} ${day.selected ? 'selected' : ''}`}
                        onClick={() => UpdateSelectedDay(day)}
                        key={index}
                    >
                        {day.dayNumber == 0 ? '' : day.dayNumber}
                    </button>
                ))}
            </div>
        </div>
    )
}