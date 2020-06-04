import axios from 'axios'
import apiUrl from '../apiConfig'

export const createCustomer = email => {
  return axios({
    method: 'POST',
    url: apiUrl + '/stripe/customer',
    data: {
      'customer': {
        'email': email
      }
    }
  })
}

export const updateCustomer = (customerId, userId, token) => {
  return axios({
    method: 'PATCH',
    url: apiUrl + '/add-stripe/' + userId,
    headers: {
      'Authorization': `Bearer ${token}`
    },
    data: {
      'user': {
        'stripeId': customerId
      }
    }
  })
}
