import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './widget.scss';
import axios from 'axios';

class Widget extends Component {
  
  state = {
    customer_id: null
  }
  
  componentDidMount() {
      axios.post("http://localhost:8080/customer",{
      })
      .then(response => {
        this.setState({customer_id: response.data.id});
      })
      .catch(err => {
        console.log(err);
      });  
  };

  render() {
    if (this.state.customer_id !== null) {
      axios.post("http://localhost:8080/customer-activity",{
        user_id: this.props.userId,
        customer_id: this.state.customer_id,
        event: 'view'
      })
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
    }
    
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
  userId: 0,
};

export default Widget;
