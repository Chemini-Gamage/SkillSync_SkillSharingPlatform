import React, { useState } from 'react'
import './LpHome.css'
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = momentLocalizer(moment)
function LPHome() {

  const [events, setEvents] = useState([
    {
      title: "Meeting",
      start: new Date(),
      end: new Date(),
      allDay: false,
    },
  ]);
  return (
    <div>
      <div className="total">
        <div className="row row-cols-1 row-cols-md-3 g-3">
          <div class="card" style={{ width: "18rem" }}>
            <div class="card-body">
              <h5 class="card-title">Total Hours</h5>
              <h6 class="card-subtitle mb-2 text-body-secondary">image</h6>
              <p class="card-text">110hrs</p>

            </div>
          </div>
          <div class="card" style={{ width: "18rem" }}>
            <div class="card-body">
              <h5 class="card-title">Completed course</h5>
              <h6 class="card-subtitle mb-2 text-body-secondary">Card subtitle</h6>
              <p class="card-text">110hrs</p>

            </div>
          </div>
          <div class="card" style={{ width: "18rem" }}>
            <div class="card-body">
              <h5 class="card-title">Total Students</h5>
              <h6 class="card-subtitle mb-2 text-body-secondary">Card subtitle</h6>
              <p class="card-text">110hrs</p>

            </div>
          </div>
        </div></div>

      <div className="calender">
        <div className="col">
          <div class="card" style={{ width: "18rem" }}>
            <div class="card-body">
              <h5 class="card-title">Calender</h5>
            
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 450 }} />

            </div>
          </div>

          <div class="card" style={{ width: "18rem" }}>
            <div class="card-body">
              <h5 class="card-title">Calender</h5>
              <h6 class="card-subtitle mb-2 text-body-secondary">Card subtitle</h6>
              <p class="card-text">days</p>

            </div>


          </div>

        </div>
        <div className="courses">
          <div className="container">
            <p>Popular courses</p>
            <div className="row">
              <div class="card" style={{ width: "18rem" }}>
                <div class="card-body">
                  <h5 class="card-title">Course</h5>
                  <h6 class="card-subtitle mb-2 text-body-secondary">Beginner</h6>
                  <p class="card-text">days</p>
                </div>
              </div>
              <div class="card" style={{ width: "18rem" }}>
                <div class="card-body">
                  <h5 class="card-title">Course</h5>
                  <h6 class="card-subtitle mb-2 text-body-secondary">Beginner</h6>
                  <p class="card-text">days</p>


                </div>
              </div>
              <div class="card" style={{ width: "18rem" }}>
                <div class="card-body">
                  <h5 class="card-title">Course</h5>
                  <h6 class="card-subtitle mb-2 text-body-secondary">Beginner</h6>
                  <p class="card-text">days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div></div>
  )
}

export default LPHome
