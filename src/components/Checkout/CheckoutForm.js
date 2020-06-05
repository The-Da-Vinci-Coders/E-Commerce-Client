import React, { useState } from 'react'
import { createCardToken, addCardToken, sendCharge } from '../../api/stripe'
import { Redirect } from 'react-router-dom'
import { getHistory, changeCartActive, createEmptyCart } from '../../api/shopping-cart'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

const StipeCheckoutForm = ({ shoppingCart, user, customer }) => {
  const [show, setShow] = useState(false)
  const [number, setNumber] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [cvc, setCvc] = useState('')
  const [redirect, setRedirect] = useState(false)
  // const [cardToken, setCardToken] = useState('')

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const onCancelPurchase = () => {
    handleClose()
    return (
      <Redirect to='/shopping-cart' />
    )
  }
  const handleChangeNumber = event => {
    setNumber(event.target.value)
  }
  const handleChangeMonth = event => {
    setMonth(event.target.value)
  }
  const handleChangeYear = event => {
    setYear(event.target.value)
  }
  const handleChangeCvc = event => {
    setCvc(event.target.value)
  }

  const handleSubmit = event => {
    event.preventDefault()
    createCardToken(number, month, year, cvc)
      .then(data => {
        const token = data.data.card.id
        // setCardToken(data.data.card.id)
        // console.log(cardToken)
        return token
      })
      .then(token => {
        addCardToken(token, customer)
      })
      .then(() => handleShow())
      .catch(console.error)
  }

  const handlePurchaseCompletion = () => {
    sendCharge(shoppingCart.totalCost, customer)
      .then(() => getHistory(user))
      .then(data => {
        const carts = data.data.shoppingCart
        const activeCart = carts.find(cart => cart.active)
        activeCart.active = false
        const id = activeCart.id
        const boolean = activeCart.active
        changeCartActive(user, id, boolean)
      })
      .then(() => {
        createEmptyCart(user)
      })
      .then(() => handleClose())
      .then(() => setRedirect(true))
      .catch(console.error)
  }

  const convertDollar = (num) => {
    const total = num * 0.01
    return total.toFixed(2)
  }

  if (!redirect) {
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
            <Button variant="primary" onClick={handlePurchaseCompletion}>
              Complete Purchase
            </Button>
          </Modal.Footer>
        </Modal>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Card Number</Form.Label>
            <Form.Control
              required
              type="text"
              name="number"
              value={number}
              placeholder="0000-0000-0000-0000"
              onChange={handleChangeNumber}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Expiration</Form.Label>
            <Form.Label>Month</Form.Label>
            <Form.Control
              required
              name="month"
              value={month}
              type="text"
              placeholder="00"
              onChange={handleChangeMonth}
            />
            <Form.Label>Year</Form.Label>
            <Form.Control
              required
              name="year"
              value={year}
              type="text"
              placeholder="0000"
              onChange={handleChangeYear}
            />
            <Form.Label>Cvc Number</Form.Label>
            <Form.Control
              required
              name="cvc"
              value={cvc}
              type="text"
              placeholder="000"
              onChange={handleChangeCvc}
            />
          </Form.Group>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </Form>
      </div>
    )
  } else {
    return (
      <Redirect to='/products' />
    )
  }
}

export default StipeCheckoutForm
