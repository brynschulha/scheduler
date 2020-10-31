import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import useVisualMode from "../../hooks/useVisualMode";
import Form from "./Form";


const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";


export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(
    //In data #1, no valu for interview.interviewer or interview.student, how to handle this??
       props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    
    const interview = {
      student: name,
      interviewer //supposed to be a number not a name
    };
    props.bookInterview(props.id, interview);
    transition(SHOW);
  }


  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && 
      
       <Show
          student={props.interview.student && props.interview? props.interview.student : "No Student Data"}
          interviewer = {props.interview.interviewer ? props.interview.interviewer.name : 'No Interviewer Data'}
        />
      }
      {mode === CREATE && (
        <Form
        interviewer = {props.interviewer}
        interviewers={props.interviewers}
        onCancel={() => back()}
        onSave={save}
        />
      )}
    </article>
  );
}
