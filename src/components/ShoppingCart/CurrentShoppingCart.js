import React, { useState, useEffect } from 'react'
import { removeFromCart } from '../../api/products'
import { getHistory } from '../../api/shopping-cart'
import { withRouter, Link } from 'react-router-dom'
import messages from '../AutoDismissAlert/messages'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
// import CardGroup from 'react-bootstrap/CardGroup'

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

  const onRemoveFromCart = (event, product) => {
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
        removeFromCart(activeCart._id, product, user)
        console.log(activeCart)
      })
      .catch(console.error)
  }

  return (
    <div>
      <h2>Shopping Cart</h2>
      {shoppingCart.products.map(product => (
        <div key={product._id}>
          <Card>
            <Card.Body>
              <Card.Title><h3>{product.name}</h3></Card.Title>
              <Card.Text><h5>{product.description}</h5></Card.Text>
            </Card.Body>
            <Button variant="danger" onClick={() => onRemoveFromCart(event, product)}>Remove item from Cart</Button>
          </Card>
        </div>
      ))}
      {shoppingCart.totalCost}
      <Link to={'/checkout'}><button>Check Out</button></Link>
    </div>
  )
}

export default withRouter(CurrentShoppingCart)
