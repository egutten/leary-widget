import React from 'react';
import PropTypes from 'prop-types';

const message = (props) => (
  <div className={props.show}>
    <div>
      <img className="logo" alt="logo" src={props.logo} />
    </div>
    <div className="text">
      <p className="event-text">{`${props.conversionEvent}!`}</p>
      <p className="time-stamp">{props.timestamp}</p>
    </div>
  </div>
);

message.propTypes = {
  logo: PropTypes.string,
  show: PropTypes.string,
  conversionEvent: PropTypes.string,
  timestamp: PropTypes.string,
};

message.defaultProps = {
  logo: null,
  show: null,
  conversionEvent: null,
  timestamp: null,
};

export default message;
