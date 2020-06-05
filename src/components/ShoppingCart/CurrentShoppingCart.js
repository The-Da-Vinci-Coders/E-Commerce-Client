import React, { useState, useEffect } from 'react'
import { removeFromCart } from '../../api/products'
import { getHistory } from '../../api/shopping-cart'
import { withRouter, Link } from 'react-router-dom'
import messages from '../AutoDismissAlert/messages'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { deepIndexOf } from '../../lib/deep-index-of'
// import CardGroup from 'react-bootstrap/CardGroup'

const CurrentShoppingCart = ({ user, setMsgAlert, match }) => {
  const [shoppingCart, setShoppingCart] = useState({
    products: [],
    quantities: [],
    totalCost: 0
  })
  const [rerender, setRerender] = useState(false)

  // const deepIndexOf = (arr, val) => {
  //   for (let i = 0; i < arr.length; i++) {
  //     if (lodash.isEqual(arr[i], val)) {
  //       return i
  //     }
  //   }
  //   return -1
  // }

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
        setMsgAlert({
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
        setMsgAlert({
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
      <h2 className="title">Shopping Cart</h2>
      {shoppingCart.products.map((product, index) => (
        <div key={product._id}>
          <Card className="container">
            <Card.Body className="cartCost row" >
              <Card.Img className="col-4" src={product.imageURL} />
              <div className="col-8">
                <Card.Title><h5>{product.name}:  {product.description}</h5></Card.Title>
                <Card.Text className="cartCost"> <p>{shoppingCart.quantities[index]} &emsp; for &emsp; ${convertDollar(product.cost * shoppingCart.quantities[index])}</p></Card.Text>
                <h5 className="removeLink" onClick={() => onRemoveFromCart(event, product)}>remove</h5>
              </div>
            </Card.Body>
          </Card>
        </div>
      ))}
      <div className="moveRight">
        <h3> Total:${convertDollar(shoppingCart.totalCost)}</h3>
        <Link to={'/checkout'}><Button className="moveRight" variant="primary">Check Out</Button></Link>
      </div>
    </div>
  )
}

export default withRouter(CurrentShoppingCart)
