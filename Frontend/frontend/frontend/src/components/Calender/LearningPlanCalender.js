
import React, { useState, useEffect } from 'react'
import axios from "axios"
import { ChevronLeft, ChevronRight, AlertCircle } from 'react-feather'
import moment from 'moment'
import { Calendar, momentLocalizer } from "react-big-calendar";
import './LearningPlanCalender.css'
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = momentLocalizer(moment)

function LearningPlanCalender(onAddPlan) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const [plans, setPlans] = useState([]);
    const [events, setEvents] = useState([
        {
            title: "Meeting",
            start: new Date(),
            end: new Date(),
            allDay: false,
        },
    ]);
    //calender with markedDates
    const markedDates = plans.map(plan => new Date(plan.deadline).toDateString());

    const tileClassName = ({ date, view }) => {
        if (view === "month" && markedDates.includes(date.toDateString)) {
            return "marked-date"
        }
        return null;
    }
    const tileContent = ({ date, view }) => {
        if (view === 'month' && markedDates.includes(date.toLocaleDateString())) {
            return (
                <div classname="date-icon">
                    <AlertCircle size={14} color="red" />
                </div>
            )
        }
        return null;
    }
    //alert
    const handleDateClick = (date) => {
        const confirmAdd = window.confirm(`do you want to add a learning plan to ${date.toDateString()}?`);
        if (confirmAdd) {
            onAddPlan(date);

        }
    };

    const handlePrevMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() - 1);
        setCurrentDate(newDate);

    }
    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + 1);
        setCurrentDate(newDate);

    }
    const handleNextYear = () => {
        const newDate = new Date(currentDate);
        newDate.setFullYear(currentDate.getYear() + 1);
        setCurrentDate(newDate);
    }
    const monthYearLabel = currentDate.toLocaleDateString('default', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    const [selectedDate, setSelectedDate] = useState(new Date());
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axios.get(`http://localhost:8089/api/learn-track`);
                const tracks = response.data;
                console.log("fetched", tracks);
                if (tracks.length > 0) {
                    const milestones = tracks[0].milestones || [];
                    const milestoneEvents = milestones.map(m => ({
                        title: m.name,
                        start: new Date(m.deadline),
                        end: new Date(m.deadline),
                        allDay: true,
                    }));
                    setEvents(milestoneEvents);

                }
            }
            catch (error) {
                console.log("error", error)
            }
        };
        fetchPlans();

    }, []
    )

    return (
        <div className="calendar-container">
            {/* Custom Header */}
            <div className="calendar-header">

                <div className="calendar-title"> <button onClick={handlePrevMonth}>
                    <ChevronLeft />
                </button>
                    {monthYearLabel}    <button onClick={handleNextMonth}>
                        <ChevronRight />
                    </button>
                </div>

            </div>

            <Calendar
                localizer={localizer}
                events={events}

                toolbar={false}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 350 }}
                date={currentDate}
                views={['month']}
                onNavigate={setSelectedDate}
                selectable
                onSelectSlot={handleDateClick}

                popup
            />

        </div>

    )
}

export default LearningPlanCalender
