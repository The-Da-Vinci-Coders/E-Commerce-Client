import React, { useState, useEffect } from 'react'
import { getProducts, addToCart } from '../../api/products'
import { getHistory } from '../../api/shopping-cart'
import { withRouter } from 'react-router-dom'
import messages from '../AutoDismissAlert/messages'

const ProductsPage = ({ user, msgAlert }) => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    getProducts()
      .then(currProducts => {
        setProducts(currProducts.data.products)
      })
      .catch(() => {
        msgAlert({
          heading: 'Product Search Failed',
          message: messages.getProductsFailure,
          variant: 'danger'
        })
      })
  }, [])

  const onAddToCart = (event, product) => {
    // get all shopping carts belonging to current user
    getHistory(user)
      .then(data => {
        const carts = data.data.shoppingCart
        // find the current active cart
        const activeCart = carts.find(cart => cart.active)
        return activeCart
      })
      .then(activeCart => {
        console.log(product)
        addToCart(activeCart._id, product, user)
      })
      .catch(console.error)
  }

  const productsMap = products.map(product => (
    <li key={product._id}>
      <h3>Name: {product.name}</h3>
      <h5>Description: {product.description}</h5>
      <h5>Category: {product.category}</h5>
      <button onClick={() => onAddToCart(event, product)}>Add To Cart</button>
    </li>
  ))

  return (
    <div>
      <h2>Available Products</h2>
      {productsMap}
    </div>
  )
}

export default withRouter(ProductsPage)
