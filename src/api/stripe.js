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

export const addCardToken = (token, id) => {
  return axios({
    method: 'PATCH',
    url: apiUrl + '/stripe/customer/' + id,
    data: {
      'customer': {
        'source': token
      }
    }
  })
}

export const createCardToken = card => {
  return axios({
    method: 'POST',
    url: apiUrl + '/stripe/card-token',
    data: {
      'card': {
        'number': card.number,
        'month': card.month,
        'year': card.year,
        'cvc': card.cvc
      }
    }
  })
}

export const sendCharge = (amount, customer) => {
  return axios({
    method: 'POST',
    url: apiUrl + '/stripe/charge',
    data: {
      'charge': {
        'amount': amount,
        'customer': customer
      }
    }
  })
}
