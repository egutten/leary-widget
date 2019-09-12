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
    timestamp: null
  }
  
  componentDidMount() {
    if (cookieJar === undefined) {
      axios.post("http://localhost:8080/customer",{
      }).then(response => {
        axios.post("http://localhost:8080/customer-activity",{
          user_id: this.props.userId,
          customer_id: response.data.id,
          event: 'view'
        }).then(response => {
          console.log(response);
        }).catch(err => {
          console.log(err);
        });
        cookies.set('customer_id', response.data.id, {path: '/', expires: new Date(Date.now()+2592000)});
      }).catch(err => {
        console.log(err);
      });  
    }
    
    axios.get("http://localhost:8080/conversion-event-id",{
    }).then(response => {
      this.setState({timestamp: response.data.timestamp});
      
      axios.post("http://localhost:8080/conversion-event-text",{
        id: response.data.conversion_event_id
      }).then(response => {
       this.setState({conversion_event_text: response.data[0].conversion_event});
      }).catch(err => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
    });  
    
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
        timestamp = {this.state.timestamp} />;
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
