import React from 'react';
import PropTypes from 'prop-types';

const message = (props) => (
  <div className={props.show}>
    <div>
      <img className="leery-logo" alt="leery-logo" src={props.logo} />
    </div>
    <div className="leery-text">
      <p className="leery-event-text">{`${props.conversionEvent}`}</p>
      <p className="leery-time-stamp">{props.timestamp}</p>
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
