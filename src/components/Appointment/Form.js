import React, { useState } from "react";
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";

export default function Form(props) {
  const[name, setName] = useState(props.name || "");
  const[interviewer, setInterviewer] = useState(props.interviewer || null);
  const[error, setError] = useState("");

  function validate() {
    if (name === "") {
      setError("Student name cannot be blank");
      return false;
    }
    // if (interviewer === null) {
    //   setError("Must select an interviewer");
    //   return false;
    // }
    return true;
  }

  const cancel = function() {
    setName("");
    setInterviewer(null);
    props.onCancel();
  }
  
  const save = function() {
    if (validate()) {
      setError("");
      props.onSave(name, interviewer)
    };
  } 


  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form onSubmit={event => event.preventDefault()} autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            /*
          This must be a controlled component
        */
            data-testid="student-name-input"
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList
          interviewers={props.interviewers}
          interviewer={interviewer}
          setInterviewer={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={() => cancel()}>Cancel</Button>
          <Button confirm onClick={() => save()}>Save</Button>
        </section>
      </section>
    </main>
  );
}
