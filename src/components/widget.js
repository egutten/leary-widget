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
    show: true,
    conversion_event_text: null,
    time_stamp: null
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
      var created = response.data[0].createdAt
      var sTime = created.split(/["T""."]/);
      var year = sTime[0];
      var yearTokens = year.split("-"); 
      var milliYear = new Date(yearTokens[0], yearTokens[1] - 1, yearTokens[2]);
      var time = sTime[1];
      var timeTokens = time.split(":");
      var milliTime = (((timeTokens[0]-7) * 3600000) + (timeTokens[1] * 60000) + (timeTokens[2] * 1000))
      var milliseconds = milliYear.getTime() + milliTime;
      var timeElapsed = (Math.round((Date.now() - milliseconds) / (1000 * 60) % 60));
      this.setState({time_stamp: timeElapsed});
      
      axios.post("http://localhost:8080/conversion-event-text",{
        id: response.data[0].conversion_event_id
      }).then(response => {
       this.setState({conversion_event_text: response.data[0].conversion_event});
      }).catch(err => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
    });  
    
    // setTimeout(() => {
    //   this.setState({show: true});
    // }, 2000)
    // 
    // setTimeout(() => {
    //   this.setState({show: false});
    // }, 6000);
  };
  
  render() {
    let message = null;
    if (this.state.show && this.state.conversion_event_text !== null) {
      message = <Message conversionEvent = {this.state.conversion_event_text} timeElapsed = {this.state.time_stamp}/>;
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
