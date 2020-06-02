import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const CheckoutForm = ({ shoppingCart }) => {
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
              <h5>{product.description}</h5>
            </div>
          ))}
          <h4>Total: {shoppingCart.totalCost}</h4>
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

export default CheckoutForm
