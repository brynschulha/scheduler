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

  const getSpotsForDay = function(state, day) {
    if(state.days.length < 1) {
      return [];
    }
    const filteredDay = state.days.find(d => d.name === day.name);
    if(!filteredDay) {
      return [];
    }
    const filteredDayAppointments = filteredDay.appointments;
    const filteredAppointments = [];
    for (let app in state.appointments) {
      const values = Object.values(state.appointments[app]);
      if(filteredDayAppointments.includes(values[0])) {
        filteredAppointments.push(state.appointments[app]);
      }
    }
    if(filteredAppointments.length < 1 || (!day)) {
      return [];
    } 
    let spotCount = 0;
    for (let appointment in filteredAppointments) {
      if(filteredAppointments[appointment].interview === null) {
        spotCount += 1;
      }
    }
    return spotCount;
  };

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }, // Ensure interview is defined or null before spread!
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const day = state.days.find((dayEntry) => {
      if(dayEntry.name === state.day) {
        return {...dayEntry}
      } 
    });
    const newState = {...state, appointments};
    day.spots = getSpotsForDay(newState, day);
    // day.spots -= 1; // getSpotsForDay(state,day);
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
        setState((prev) => ({...prev, appointments, days}));

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

    const day = state.days.find((dayEntry) => {
      if(dayEntry.name === state.day) {
        return {...dayEntry}
      } 
    });
    const newState = {...state, appointments};
    day.spots = getSpotsForDay(newState, day);
    // day.spots -= 1; // getSpotsForDay(state,day);
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
        return setState((prev) => ({ ...prev, appointments, days}));
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
