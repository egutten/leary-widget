import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './widget.scss';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Message from './Message.js';

const cookies = new Cookies();

var cookieJar = cookies.get('customer_id');
console.log(cookies.get('customer_id'))

// cookies.remove('customer_id');

class Widget extends Component {

  state = {
    customer_id: null,
    show: false,
    conversion_event_id: null,
    conversion_event: null
  }
  
  componentDidMount() {
    if (cookieJar === undefined) {
      axios.post("http://localhost:8080/customer",{
      }).then(response => {
        this.setState({customer_id: response.data.id});
      }).catch(err => {
        console.log(err);
      });  
    }
    
    axios.get("http://localhost:8080/conversion-event-id",{
    }).then(response => {
      this.setState({conversion_event_id: response.data[0].conversion_event_id});
    }).catch(err => {
      console.log(err);
    });  
    
    
    setTimeout(() => {
      this.setState({show: true});
    }, 2000)
  };

  render() {
    
    if (this.state.customer_id !== null) {
      axios.post("http://localhost:8080/customer-activity",{
        user_id: this.props.userId,
        customer_id: this.state.customer_id,
        event: 'view'
      }).then(response => {
        console.log(response);
      }).catch(err => {
        console.log(err);
      });
      
      cookies.set('customer_id', this.state.customer_id, {path: '/', expires: new Date(Date.now()+2592000)});
    }

    if (this.state.conversion_event_id !== null) {
      axios.post("http://localhost:8080/conversion-event-text",{
        id: this.state.conversion_event_id
      }).then(response => {
       console.log(response.data[0].conversion_event);
      }).catch(err => {
        console.log(err);
      });
    }
    
    let message = null;
    if (this.state.show) {
      message = <Message />;
      setTimeout(() => {
        this.setState({show: false});
      }, 4000)
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
