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
    conversion_event_id: null
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
    
    setTimeout(() => {
      this.setState({show: false});
    }, 6000);
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
    
    let message = null;
    if (this.state.show && this.state.conversion_event_id !== null) {
      message = <Message conversionEventId = {this.state.conversion_event_id}/>;
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
