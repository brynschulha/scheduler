export function getAppointmentsForDay(state, day) {
  if(state.days.length < 1) {
    return [];
  }
  const filteredDay = state.days.find(d => d.name === day);
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
  } else {
  return filteredAppointments;
  }
};

export function getInterviewersForDay(state, day) {
  if(state.days.length < 1) {
    return [];
  }
  const filteredDay = state.days.find(d => d.name === day);
  if(!filteredDay) {
    return [];
  }
  const filteredDayInterviewers = filteredDay.interviewers;
  const filteredInterviewers = [];
  for (let int in state.interviewers) {
    const values = Object.values(state.interviewers[int]);
    if(filteredDayInterviewers.includes(values[0])) {
      filteredInterviewers.push(state.interviewers[int]);
    }
  }
  if(filteredInterviewers.length < 1 || (!day)) {
    return [];
  } else {
  return filteredInterviewers;
  }
};

export function getInterview(state, interview) {
  if(interview) {
    return {
      student: interview.student,
      interviewer: state.interviewers[interview.interviewer]
    };
  }
  return null;

};