/* import React, { useState, useEffect } from 'react'
import { getCurrentCarts } from '../../api/products'
import { withRouter } from 'react-router-dom'

const CurrentShoppingCart = (props) => {
  const [shoppingCart, setShoppingCart] = useState({})
  const [user, setUser] = useState(props.user)

  useEffect(() => {
    getCurrentCart(user._id)
      .then(cart => {
        const carts = cart.shoppingCart
        const newCarts = []
        for (let i = 0; i < carts.length; i++) {
          if (carts[i].active) {
            newCarts.push(carts[i])
          }
        }
        setShoppingCart(newCarts)
      })
  })
}

export default ShoppingCart */
