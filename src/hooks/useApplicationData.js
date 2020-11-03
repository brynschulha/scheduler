import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }, // Ensure interview is defined or null before spread!
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const day = state.days.find((dayEntry) => dayEntry.name === state.day);
    day.spots -= 1;
    const days = state.days.map((dayEntry) => {
      if (dayEntry.name === day.name) {
        return day;
      } else {
        return dayEntry;
      }
    });
    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(() => {
        setState({ ...state, appointments, days });
      })
      .catch((err) => {
        throw err;
      });
  }

  function cancelInterview(id, interview) {
    interview = null;
    const appointment = {
      ...state.appointments[id],
      interview: interview,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const day = state.days.find((dayEntry) => dayEntry.name === state.day);
    day.spots += 1;
    const days = state.days.map((dayEntry) => {
      if (dayEntry.name === day.name) {
        return day;
      } else {
        return dayEntry;
      }
    });

    return axios
      .delete(`/api/appointments/${id}`, interview)
      .then(() => {
        return setState({ ...state, appointments });
      })
      .catch((err) => {
        throw err;
      });
  }

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

  return { state, setDay, bookInterview, cancelInterview };
}
