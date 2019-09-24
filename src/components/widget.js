import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './widget.scss';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Message from './Message.js';
// import { createCustomer, setCookieToCustomerId, getMessages } from './../helpers/widget-helpers';

const cookies = new Cookies();

var cookieJar = cookies.get('customer_id');

class Widget extends Component {
  state = {
    show: "message-box hidden",
    conversion_event_text: null,
    timestamp: null,
    logo: null,
    customer_id: null
  }
  
  componentDidMount() {
    var that = this;
    
    function createCustomer() {
      return axios.post("http://localhost:8080/customer-activity",{
        user_id: that.props.userId,
        event: 'view'
      }).then(response => {
        return response;
      })
    };
    
    function setCustomerIdFromState(customer_id) {
      return new Promise((resolve, reject) => {
        cookies.set('customer_id', customer_id.data, {path: '/', expires: new Date(Date.now() + 2592000)});
        that.setState({customer_id: customer_id.data}, () => {
          axios.post("http://localhost:8080/messages", {
            user_id: that.props.userId,
            customer_id: that.state.customer_id
          }).then(response => {
            resolve(response);
          })
        });  
      });
    };  
    
    function setCustomerIdFromCookie() {
      return axios.post("http://localhost:8080/messages", {
        user_id: that.props.userId,
        customer_id: cookies.get('customer_id')
      }).then(response => {
        return response;
      });
    };
    
    function setMessageDataToState(message) {
      that.setState({
        conversion_event_text: message.data.conversion_event,
        logo: "//logo.clearbit.com/" + message.data.logo,
        timestamp: message.data.timestamp
      });
    };
    
    if (cookieJar === undefined) {
      createCustomer()
      .then((customer_id) => {
        setCustomerIdFromState(customer_id)
        .then((message) => {
          setMessageDataToState(message);
        });
      });
    } else {
      setCustomerIdFromCookie()
      .then((message) => {
        setMessageDataToState(message);
      });
    };

    setTimeout(() => {
      this.setState({show: "message-box entering" + " " + this.props.position});
    }, 2000)
    
    setTimeout(() => {
      this.setState({show: "message-box exiting" + " " + this.props.position});
    }, 6000);
  }  
  
  render() {
    let message = null;
    if (this.state.conversion_event_text !== null) {
      message = <Message 
        show = {this.state.show}
        conversionEvent = {this.state.conversion_event_text} 
        timestamp = {this.state.timestamp}
        logo = {this.state.logo} />;
    };
    
    return (
      <React.Fragment>
       {message}
     </React.Fragment>
    );
  }
}

Widget.propTypes = {
  userId: PropTypes.number,
  position: PropTypes.string
};

Widget.defaultProps = {
  userId: 0,
  position: null
};

export default Widget;
