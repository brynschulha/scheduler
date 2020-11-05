import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  prettyDOM,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  waitForElementToBeRemoved,
  queryByText,
  queryByAltText
} from "@testing-library/react";

import Application from "components/Application";

import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
    await waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();
    await waitForElementToBeRemoved(() => getByText(appointment, "SAVING"));
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
      );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation button is shown.
    expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();

    // 5. Click the "Confirm" button.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "DELTEING" is displayed.
    expect(getByText(appointment, "DELETING")).toBeInTheDocument();

    // 7. Wait until the element with the text "DELETING" is removed.
    await waitForElementToBeRemoved(() => getByText(appointment, "DELETING"));
    
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
      );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const {container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Edit"));

    // 4. Check that the save button is shown.
    expect(getByText(appointment, "Save")).toBeInTheDocument();

    // 5. Click the "Save" button.
    fireEvent.click(getByText(appointment, "Save"));

    // 6. Check that the element with the text "SAVING" is displayed.
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();

    // 7. Wait until the element with the text "SAVING" is removed.
    await waitForElementToBeRemoved(() => getByText(appointment, "SAVING"));

    // 8. Check that the DayListItem with the text "Monday" still has the text "1 spot remaining".
      const day = getAllByTestId(container, "day").find(day =>
        queryByText(day, "Monday")
        );
      expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();
    await waitForElement(() => getByText(container, "Could not save appointment"));
    expect(getByAltText(appointment, "Close")).toBeInTheDocument();
    fireEvent.click(getByAltText(appointment, "Close"));
    expect(getByAltText(appointment, "Add")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation button is shown.
    expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();

    // 5. Click the "Confirm" button.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "DELTEING" is displayed.
    expect(getByText(appointment, "DELETING")).toBeInTheDocument();

    // 7. Wait for the "Could not delete appointment" text to appear.
    await waitForElement(() => getByText(container, "Could not delete appointment"));

    // 8. Check that the close button is shown.
    expect(getByAltText(appointment, "Close")).toBeInTheDocument();

    // 9. Click the close button.
    fireEvent.click(getByAltText(appointment, "Close"));

    // 10. Check that "Archie Cohen" is displayed again.
    expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();
  })
});
