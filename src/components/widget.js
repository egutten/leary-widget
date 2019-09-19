import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './widget.scss';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Message from './Message.js';

const cookies = new Cookies();

var cookieJar = cookies.get('customer_id');
console.log(cookies.get('customer_id'));

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
        return new Promise((resolve, reject) => {
          axios.post("http://localhost:8080/customer-activity",{
            user_id: that.props.userId,
            event: 'view'
          }).then(response => {
            resolve(response);
          })
        })
      }
      
      function setCustomerIdFromState() {
        createCustomer().then((response) => {
          cookies.set('customer_id', response.data, {path: '/', expires: new Date(Date.now()+2592000)});
          that.setState({customer_id: response.data}, () => 
            axios.post("http://localhost:8080/messages", {
              user_id: that.props.userId,
              customer_id: that.state.customer_id
            }).then(response => {
              that.setState({
                conversion_event_text: response.data.conversion_event,
                logo: "//logo.clearbit.com/" + response.data.logo,
                timestamp: response.data.timestamp});
            })
          )
        })
      }
      
      function setCustomerIdFromCookie() {
        axios.post("http://localhost:8080/messages", {
          user_id: that.props.userId,
          customer_id: cookies.get('customer_id')
        }).then(response => {
          that.setState({
            conversion_event_text: response.data.conversion_event,
            logo: "//logo.clearbit.com/" + response.data.logo,
            timestamp: response.data.timestamp});
        })
      }
      
      if (cookieJar === undefined) {
        setCustomerIdFromState();
      } else {
        setCustomerIdFromCookie();
      }

    setTimeout(() => {
      this.setState({show: "message-box entering"});
    }, 2000)
    
    setTimeout(() => {
      this.setState({show: "message-box exiting"});
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
  userId: PropTypes.number
};

Widget.defaultProps = {
  userId: 0,
};

export default Widget;
