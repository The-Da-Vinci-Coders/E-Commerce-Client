import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { getHistory } from '../../api/shopping-cart'
import messages from '../AutoDismissAlert/messages'
import Card from 'react-bootstrap/Card'

const ShoppingHistory = ({ user, msgAlert }) => {
  const [shoppingHistory, setShoppingHistory] = useState([])

  useEffect(() => {
    getHistory(user)
      .then(data => {
        const carts = data.data.shoppingCart
        const inactiveCarts = carts.filter(cart => !cart.active)
        console.log(inactiveCarts)
        setShoppingHistory(inactiveCarts)
        console.log(shoppingHistory)
      })
      .catch(() => {
        msgAlert({
          heading: 'Purchase History Failed',
          message: messages.getPurchaseHistory,
          variant: 'danger'
        })
      })
  }, [])

  const convertDollar = (num) => {
    const total = num * 0.01
    return total.toFixed(2)
  }

  return (
    <div>
      <h2>Purchase History:</h2>
      {shoppingHistory && shoppingHistory.map(shoppingCart => (
        <div key={shoppingCart._id}>
          <h3>Purchase:</h3>
          {shoppingCart.products.map(product => (
            <div key={product._id}>
              <Card>
                <Card.Body>
                  <Card.Title><h3>{product.name}</h3></Card.Title>
                  <Card.Text><h5>{product.description}</h5></Card.Text>
                  <Card.Text><h6>${convertDollar(product.cost)}</h6></Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
          <h4>Total:${convertDollar(shoppingCart.totalCost)}</h4>
        </div>
      ))}
    </div>
  )
}

export default withRouter(ShoppingHistory)
