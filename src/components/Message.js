import React from 'react'; 


const message = (props) => (
  
  <div className={props.show}>
    <div>
        <img className="logo" src={props.logo}/>
    </div>
    <div className="text">
      <p className="event-text">{props.conversionEvent + "!"}</p>
      <p className="time-stamp">{props.timestamp}</p>
    </div>
  </div> 
);

export default message;
