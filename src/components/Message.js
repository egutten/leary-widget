import React, { Component } from 'react'; 
import axios from 'axios';

class Message extends Component {
  
  state = {
    conversion_event_text: null
  }

  render() {
  
    axios.post("http://localhost:8080/conversion-event-text",{
      id: this.props.conversionEventId
    }).then(response => {
     this.setState({conversion_event_text: response.data[0].conversion_event});
    }).catch(err => {
      console.log(err);
    });
    
    return (
      <div className="message-box">
        <p className="event-text">{this.state.conversion_event_text + "!"}</p>
      </div> 
    );
  }
}

export default Message;
