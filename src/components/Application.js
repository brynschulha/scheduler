import React, { useState, useEffect } from "react";
import DayList from "components/DayList.js";
import "components/Application.scss";
import Appointment from "components/Appointment/index.js";
import axios from "axios";
import { getAppointmentsForDay } from "../helpers/selectors.js";
import { getInterview } from "../helpers/selectors.js";
import { getInterviewersForDay } from "../helpers/selectors.js";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  function bookInterview(id, interview) {
    console.log("bookInterview", id, interview);

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }, // Ensure interview is defined or null before spread!
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    axios
      .put(`/api/appointments/${id}`, { interview })
      .then(
        () => setState({ ...state, appointments }),
        console.log("state", state)
      )
      .catch((err) => console.log(err));
  }

  // function cancelInterview (id, interview) {
  //   console.log('cancelInterview', id ,interview);
  //   interview = null
  //   console.log('interview', interview);
  //   const appointment = {
  //     ...state.appointments[id],
  //     interview: {} // Ensure interview is defined or null before spread!
  //   };
  //   const appointments = {
  //     ...state.appointments,
  //     [id]: appointment
  //   };
  //   setState({
  //     ...state,
  //     appointments
  //   });
  // };

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);
  const schedule = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        {...appointment}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        // cancelInterview={cancelInterview}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
