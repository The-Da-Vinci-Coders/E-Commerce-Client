import apiUrl from '../apiConfig'
import axios from 'axios'

export const createEmptyCart = user => {
  return axios({
    url: apiUrl + '/shopping-cart',
    method: 'PATCH',
    data: {
      'shoppingCart': {
        'products': [],
        'user': `${user._id}`,
        'active': true,
        'totalCost': 0,
        'stripeId': null
      }
    },
    headers: {
      'Authorization': `Bearer ${user.token}`
    }
  })
}

export const getHistory = user => {
  return axios({
    url: apiUrl + '/shopping-cart',
    headers: {
      'Authorization': `Bearer ${user.token}`
    }
  })
}
