import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './widget.scss';
import axios from 'axios';

class Widget extends Component {
  // 
  // state = {
  //   customer_id: null
  // }
  
  componentDidMount() {
    axios.post("http://localhost:8080/customer",{
    })
    .then(response => {
      console.log(response.data);
    })
    .catch(err => {
      console.log(err);
    });
  };

  render() {
    
    const {userId} = this.props;
    
    console.log(userId);
    
    return (
      <div className="docked-widget">
        <div className="widget-body">
          <p>This will be the widget!</p>
        </div>
      </div>
    );
  }
}

Widget.propTypes = {
  userId: PropTypes.number
};

Widget.defaultProps = {
  userId: '0',
};

export default Widget;
