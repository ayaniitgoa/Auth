import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import "./IndividualEventRegistration.css";
import { data } from "../IndividualEvent/eventData";
import pantheon from "./pantheon.svg";
import axios from "axios";

function IndividualEventRegistraion(props) {
  const [numOfFields, setNumOfFields] = useState(0);
  const [eventLabel, setEventLabel] = useState("");
  const [eventname, setEventName] = useState("");
  const [email, setEmail] = useState([]);

  const updateEmails = (index, val) => {
    // console.log(index, val);
    const updatedArray = [...email];
    updatedArray[index] = val;
    setEmail(updatedArray);
  };

  const onEmailSubmit = (e) => {
    e.preventDefault();
    console.log(email);
    axios
      .post(
        `http://localhost:5000/api/${eventname}/register`,
        {
          email,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // const [uuidArray, setUUIDArray] = useState([]);
  useEffect(() => {
    data.map((e, i) => {
      if (e.eventName === props.match.params.eventName) {
        setNumOfFields(e.numOfFields);
        setEventLabel(e.label);
        setEventName(e.eventName);
      }
      return numOfFields;
    });
  }, [numOfFields, props]);
  return (
    <div>
      <div className="ind-eve-register">
        <Link to="/">
          <i className="ind-event-back-register ind-event-back fas fa-chevron-left"></i>
        </Link>
        <div className="ind-eve-register-main">
          <div className="ind-eve-title-register">
            <p>{eventLabel} Registeration</p>
          </div>
          {
            <form onSubmit={onEmailSubmit}>
              <div className="ind-eve-register-fields">
                {Array.apply(null, { length: numOfFields }).map((e, i) => (
                  <div key={i} className="">
                    <input
                      placeholder={`email${i + 1}`}
                      onChange={(e) => {
                        updateEmails(i, e.target.value);
                      }}
                    />
                  </div>
                ))}
              </div>
              <button type="submit">Submit</button>
            </form>
          }
        </div>
      </div>
      <img className="ind-pantheon-register" src={pantheon} alt="" />
    </div>
  );
}

export default withRouter(IndividualEventRegistraion);
