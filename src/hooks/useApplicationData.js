import React, {useState, useEffect } from "react";
import axios from 'axios';

export default function useApplicationData () {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  function bookInterview(id, interview) {
    console.log('bookInterview', id, interview);
    
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview } // Ensure interview is defined or null before spread!
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios
    .put(
      `/api/appointments/${id}`, 
        {interview}
    )
    .then(() => {
      console.log('state', state)
      setState({...state, appointments})
    })
    .catch(err => {
      console.log(err)
      throw err
    });
  };

  function cancelInterview (id, interview) {
    console.log('cancelInterview', id ,interview);
    interview = null;
    console.log('interview', interview);
    const appointment = {
      ...state.appointments[id],
      interview: interview 
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    console.log(interview)
    return axios
    .delete(
      `/api/appointments/${id}`, 
      interview
    )
    .then(() => {
      console.log('state', state);
      return setState({...state, appointments});
    })
    .catch(err => {
      console.log("Error in axios delete", err);
      throw err;
    });
  }

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ])
    .then((all) => {
      setState(prev => ({...prev, 
        days: all[0].data, 
        appointments: all[1].data, 
        interviewers: all[2].data
    }));
  })}, []);

  return {state, setDay, bookInterview, cancelInterview};
};