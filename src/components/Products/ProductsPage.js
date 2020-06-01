import React, { useState, useEffect } from 'react'
import { getProducts, addToCart } from '../../api/products'
import { getHistory, createEmptyCart } from '../../api/shopping-cart'
import { withRouter } from 'react-router-dom'

const ProductsPage = ({ user, setMsgAlerts }) => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    getProducts(user)
      .then(currProducts => {
        setProducts(currProducts.data.products)
      })
      .catch(console.error)
  }, [])

  const onAddToCart = (event, product) => {
    // get all shopping carts belonging to current user
    getHistory(user)
      // if this goes fine, take the carts and find the active cart
      .then(data => {
        const carts = data.data.shoppingCart
        return carts
      })
      .then(activeCart => {
        let newCart
        // if there is no active cart
        if (!activeCart) {
          // make a new empty one
          newCart = createEmptyCart(user)
        // if there is, we just want to return it
        } else {
          newCart = activeCart
        }
        return newCart
      })
      .then(newCart => addToCart(newCart._id, product, user))
      .then(console.log)
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
