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

export function getInterview(state, interview) {
  if(!interview) {
    return null;
  }
  const interviewerId = interview.interviewer.toString();
  // const interviewInfo = {};
  // interviewInfo["student"] = interview.student;
  // interviewInfo["interviewer"] = state.interviewers[interviewerId];
  const student = interview.student;
  const interviewer = state.interviewers[interviewerId];
  // return interviewInfo;
  return {student, interviewer};
};