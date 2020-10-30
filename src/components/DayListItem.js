import React from "react";
import classNames from 'classnames/bind';
import "components/DayListItem.scss";

export default function DayListItem(props) {
  const formatSpots = function () {
    if (props.spots === 0) {
      return <p>no spots remaining</p>
    }
    if (props.spots === 1) {
      return <p>{props.spots} spot remaining</p>
    }
    if (props.spots > 1) {
      return <p>{props.spots} spots remaining</p>
    }
  };

  let dayClass = classNames(
    'day-list__item',
    {'day-list__item--selected': props.selected},
    {'day-list__item--full': props.spots === 0}
 );

  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots()}</h3>
    </li>
  );
}