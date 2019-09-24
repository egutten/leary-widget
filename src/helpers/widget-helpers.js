import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const createCustomer = (data) => {
  return axios.post('http://localhost:8080/customer-activity', {
      user_id: data.user_id,
      event: 'view'
    }).then(response => {
      return response;
    });
};

export const setCookieToCustomerId = (customer_id) => {
  return cookies.set('customer_id', customer_id, {path: '/', expires: new Date(Date.now() + 2592000)});
}; 


export const getMessages = (data) => {
  axios.post('http://localhost:8080/messages', {
    user_id: data.user_id,
    customer_id: data.customer_id
  }).then(response => {
    return response;
  });
};
