import React from 'react'; 


const message = (props) => (
  
  <div className="message-box entering">
    <div className="logo">
    </div>
    <div className="text">
      <p className="event-text">{props.conversionEvent + "!"}</p>
      <p className="time-stamp">{props.timestamp}</p>
    </div>
  </div> 
);

export default message;
