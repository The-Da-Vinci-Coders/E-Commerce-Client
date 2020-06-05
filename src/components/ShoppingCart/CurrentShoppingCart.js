import React, { useState, useEffect } from 'react'
import { removeFromCart } from '../../api/products'
import { getHistory } from '../../api/shopping-cart'
import { withRouter, Link } from 'react-router-dom'
import messages from '../AutoDismissAlert/messages'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import lodash from 'lodash'
// import CardGroup from 'react-bootstrap/CardGroup'

const CurrentShoppingCart = ({ user, msgAlert, match }) => {
  const [shoppingCart, setShoppingCart] = useState({
    products: [],
    quantities: [],
    totalCost: 0
  })
  const [rerender, setRerender] = useState(false)

  const deepIndexOf = (arr, val) => {
    for (let i = 0; i < arr.length; i++) {
      if (lodash.isEqual(arr[i], val)) {
        return i
      }
    }
    return -1
  }

  useEffect(() => {
    getHistory(user)
      .then(data => {
        const carts = data.data.shoppingCart
        const activeCart = carts.find(cart => cart.active)
        const currCart = {
          products: [],
          quantities: [],
          totalCost: 0
        }
        currCart.totalCost = activeCart.totalCost
        for (let i = 0; i < activeCart.products.length; i++) {
          const currProduct = activeCart.products[i]
          if (deepIndexOf(currCart.products, currProduct) === -1) {
            currCart.products.push(currProduct)
            const index = deepIndexOf(currCart.products, currProduct)
            currCart.quantities[index] = 1
          } else {
            const index = deepIndexOf(currCart.products, currProduct)
            currCart.quantities[index] += 1
          }
        }
        setShoppingCart(currCart)
      })
      .catch(() => {
        msgAlert({
          heading: 'Shopping Cart Failed',
          message: messages.getCartFailure,
          variant: 'danger'
        })
      })
  }, [rerender])

  const onRemoveFromCart = (event, product) => {
  // get all shopping carts belonging to current user
    getHistory(user)
      .then(data => {
        const carts = data.data.shoppingCart
        const activeCart = carts.find(cart => cart.active)
        removeFromCart(activeCart._id, product, user)
      })
      .then(() => setRerender(!rerender))
      .catch(() => {
        msgAlert({
          heading: 'Shopping Cart Failed',
          message: messages.removeCartFailure,
          variant: 'danger'
        })
      })
  }

  const convertDollar = (num) => {
    const total = num * 0.01
    return total.toFixed(2)
  }

  return (
    <div>
      <h2>Shopping Cart</h2>
      {shoppingCart.products.map((product, index) => (
        <div key={product._id}>
          <Card>
            <Card.Body>
              <Card.Title><h3>{product.name}</h3></Card.Title>
              <Card.Text><h5>{product.description}</h5></Card.Text>
              <Card.Text><h5>{shoppingCart.quantities[index]}</h5></Card.Text>
              <Card.Text><h6>${convertDollar(product.cost * shoppingCart.quantities[index])}</h6></Card.Text>
              <Button variant="danger" onClick={() => onRemoveFromCart(event, product)}>Remove</Button>
            </Card.Body>
          </Card>
        </div>
      ))}

      <h3>Total:${convertDollar(shoppingCart.totalCost)}  </h3>
      <Link to={'/checkout'}><Button variant="success">Check Out</Button></Link>
    </div>
  )
}

export default withRouter(CurrentShoppingCart)
