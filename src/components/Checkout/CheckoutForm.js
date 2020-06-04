import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { getHistory, changeCartActive, createEmptyCart } from '../../api/shopping-cart'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
// import { sendPayment } from '../../api/stripe'
const stripePromise = require('stripe')('pk_test_51Gq3g3HMAAEaJ64PjSp9hCSzsviUDW0rAFxo4mxBVaNW3pcVGPd4cSqLDxdvMb732wtspXeFtlUuSWdfadfnWSQ1008BtvXx70')

const StipeCheckoutForm = ({ shoppingCart, user }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const onCancelPurchase = () => {
    handleClose()
    return (
      <Redirect to='/shopping-cart' />
    )
  }

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement)

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement
    })

    if (error) {
      console.log('[error]', error)
    } else {
      console.log('[PaymentMethod]', paymentMethod)
      handleShow()
    }
    console.log(stripe)
    stripePromise.charges.create(
      {
        amount: 2000,
        currency: 'usd'
      }
    )
      .then(
        getHistory(user)
          .then(data => {
            const carts = data.data.shoppingCart
            const activeCart = carts.find(cart => cart.active)
            activeCart.active = false
            return activeCart
          }))
      .then(activeCart => {
        const id = activeCart.id
        const boolean = activeCart.active
        changeCartActive(user, id, boolean)
      })
      .then(res => {
        const currUser = res.data.user
        return currUser
      })
      .then(currUser => {
        createEmptyCart(currUser)
      })
      .then(<Redirect to='/products' />)
      .catch(console.error)
  }

  const convertDollar = (num) => {
    const total = num * 0.01
    return total.toFixed(2)
  }

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Review Your Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {shoppingCart.products.map(product => (
            <div key={product._id}>
              <h3>{product.name}</h3>
              <h6>Price:${convertDollar(product.cost)} </h6>
            </div>
          ))}
          <h4>Total:${convertDollar(shoppingCart.totalCost)} </h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCancelPurchase}>
            Cancel Purchase
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Complete Purchase
          </Button>
        </Modal.Footer>
      </Modal>
      <form onSubmit={handleSubmit}>
        <CardElement
          stripe={stripePromise}
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4'
                }
              },
              invalid: {
                color: '#9e2146'
              }
            }
          }}
        />
        <button type="submit" disabled={!stripe}>
          Pay
        </button>
      </form>
    </div>
  )
}

export default StipeCheckoutForm
