import React from 'react'; 

const message = (props) => (
  <div className="message-box">
    <p className="event-text">{props.conversionEvent + "!"}</p>
  </div> 
);

export default message;
