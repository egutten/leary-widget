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
    logo: null
  }
  
  componentDidMount() {
    if (cookieJar === undefined) {
      //Create customer on load
      axios.post("http://localhost:8080/customer",{
      }).then(response => {
        
        //Create customer-acvitity (visit) on load
        axios.post("http://localhost:8080/customer-activity",{
          user_id: this.props.userId,
          customer_id: response.data.id,
          event: 'view'
        }).then(response => {
          console.log(response);
        }).catch(err => {
          console.log(err);
        });
        
        //Set cookie for customer
        cookies.set('customer_id', response.data.id, {path: '/', expires: new Date(Date.now()+2592000)});
      }).catch(err => {
        console.log(err);
      });  
    }
    
    //check that there is adequate data in the system to form a message
    axios.post("http://localhost:8080/message-check", {
      user_id: this.props.userId
    }).then(response => {
      if (response.data.length > 0) {
        //Assemble all data to render a message
        axios.post("http://localhost:8080/message", {
          user_id: this.props.userId
        }).then(response => {
          this.setState({
            conversion_event_text: response.data.conversion_event,
            logo: "//logo.clearbit.com/" + response.data.logo,
            timestamp: response.data.timestamp
          });
          
          //Record message logo that customer saw
          axios.post("http://localhost:8080/customer-props", {
            logo: response.data.logo,
            customer_id: cookies.get('customer_id')
          }).then(response => {
            console.log(response);
          }).catch(err => {
            console.log(err);
          })
          
          console.log(response);
        }).catch(err => {
          console.log(err);
        });  
      }
    }).catch(err => {
      console.log(err);
    });
    
    //Set timeouts to make the message appear and disappear
    setTimeout(() => {
      this.setState({show: "message-box entering"});
    }, 2000)
    
    setTimeout(() => {
      this.setState({show: "message-box exiting"});
    }, 6000);
  };
  
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
