import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import useVisualMode from "../../hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = async (name, interviewer) => {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);
    await props.bookInterview(props.id, interview);
    transition(SHOW);
  }

  const deleting = async (id, interview) => {
    transition(DELETING);
    await props.cancelInterview(id, interview);
    transition(EMPTY);
  }

  return (
    <article className="appointment">
      <Header time={props.time} />

      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          // student={props.interview &&  props.interview.student ? props.interview.student : "No Student Data"}
          // interviewer = {props.interview.interviewer ? props.interview.interviewer.name : 'No Interviewer Data'}
          student={props.interview ? props.interview.student : ""}
          interviewer={
            props.interview && props.interview.interviewer
              ? props.interview.interviewer.name
              : ""
          }
          onDelete = {() => transition(CONFIRM)}
          onEdit = {() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewer={props.interviewer}
          interviewers={props.interviewers}
          onCancel={() => back()}
          // onSave={() => save()}
          onSave={save}
        />
      )}
      {mode === SAVING && <Status message={"SAVING"} />}
      {mode === DELETING && <Status message={"DELETING"} />}
      {mode === CONFIRM && 
        <Confirm 
          message = {"Delete the appointment?"}
          onCancel={() => back()}
          onConfirm={() => deleting(props.id, props.interview)}
          />}
      {mode === EDIT && (
        <Form
          name ={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={() => back()}
          // onSave={() => save()}
          onSave={save}
        />
      )}
    </article>
  );
}
