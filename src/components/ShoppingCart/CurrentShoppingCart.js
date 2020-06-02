import React, { useState, useEffect } from 'react'
import { getHistory } from '../../api/shopping-cart'
import { withRouter, Link } from 'react-router-dom'
import messages from '../AutoDismissAlert/messages'

const CurrentShoppingCart = ({ user, msgAlert, match }) => {
  const [shoppingCart, setShoppingCart] = useState({
    products: []
  })

  useEffect(() => {
    getHistory(user)
      .then(data => {
        const carts = data.data.shoppingCart
        const activeCart = carts.find(cart => cart.active)
        setShoppingCart(activeCart)
      })
      .catch(error => {
        msgAlert({
          heading: 'Shopping Cart Failed',
          message: messages.getCartFailure,
          variant: 'danger'
        })
        console.error(error)
      })
  }, [])

  return (
    <div>
      <h2>Shopping Cart</h2>
      {console.log(shoppingCart.products)}
      {shoppingCart.products.map(product => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <h5>{product.description}</h5>
        </div>
      ))}
      {shoppingCart.totalCost}
      <Link to='/checkout'><button>Check Out</button></Link>
    </div>

  )
}

export default withRouter(CurrentShoppingCart)
