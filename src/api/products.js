import apiUrl from '../apiConfig'
import axios from 'axios'

export const getProducts = () => {
  return axios({
    url: apiUrl + '/products'
  })
}

export const getOneProduct = id => {
  return axios({
    url: apiUrl + '/products/' + id
  })
}

export const addToCart = (id, product, user) => {
  return axios({
    url: apiUrl + '/shopping-cart/' + id,
    method: 'PATCH',
    data: product,
    headers: {
      'Authorization': `Bearer ${user.token}`
    }
  })
}
