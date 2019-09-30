import React, { Component } from 'react';
import './widget.scss';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Message from './Message';

const cookies = new Cookies();

const cookieJar = cookies.get('customerId');

const url = window.location.href.indexOf('localhost') ? 'http://localhost:8080' : 'https://getleery.com';

class Widget extends Component {
  state = {
    show: 'message-box hidden',
    conversion_event_text: null,
    timestamp: null,
    logo: null,
    customer_id: null,
    position: null,
  }
  
  componentDidMount() {
    const that = this;
    function createCustomer() {
      return axios.post(`${url}/customer-activity`, {
        user_id: that.props.userId,
        event: 'view',
      }).then((response) => response);
    }
    function setCustomerIdFromState(customer_id) {
      return new Promise((resolve) => {
        cookies.set('customerId', customer_id.data, { path: '/', expires: new Date(Date.now() + 2592000) });
        that.setState({ customer_id: customer_id.data }, () => {
          axios.post(`${url}/messages`, {
            user_id: that.props.userId,
            customer_id: that.state.customer_id,
          }).then((response) => {
            resolve(response);
          });
        });
      });
    }
    function setCustomerIdFromCookie() {
      return axios.post(`${url}/messages`, {
        user_id: that.props.userId,
        customer_id: cookieJar,
      }).then((response) => response);
    }
    function setMessageDataToState(message) {
      that.setState({
        conversion_event_text: message.data.conversion_event,
        logo: `//logo.clearbit.com/${message.data.logo}`,
        timestamp: message.data.timestamp,
        position: message.data.position,
      });
    }
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
    }
    setTimeout(() => {
      this.setState({ show: `message-box entering ${this.state.position}` });
    }, 2000);
    setTimeout(() => {
      this.setState({ show: `message-box exiting ${this.state.position}` });
    }, 6000);
  }
  
  render() {
    let message = null;
    if (this.state.conversion_event_text !== null) {
      message = (
        <Message
          show={this.state.show}
          conversionEvent={this.state.conversion_event_text}
          timestamp={this.state.timestamp}
          logo={this.state.logo}
        />
      );
    }
    return (
      <React.Fragment>
        {message}
      </React.Fragment>
    );
  }
}

Widget.defaultProps = {
  userId: 0,
};

export default Widget;
