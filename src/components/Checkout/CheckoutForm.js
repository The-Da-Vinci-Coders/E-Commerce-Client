import React, { useState } from 'react'
import { createCardToken, addCardToken, sendCharge } from '../../api/stripe'
import { Redirect, Link } from 'react-router-dom'
import { getHistory, changeCartActive, createEmptyCart } from '../../api/shopping-cart'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'

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
            <Modal.Title className="title">Review Your Purchase</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {shoppingCart.products.map((product, index) => (
              <div key={product._id}>
                <Card className="container">
                  <Card.Body className="cartCost row" >
                    <Card.Img className="col-4" src={product.imageURL} />
                    <div className="col-8">
                      <Card.Title><h5>{product.name}:  {product.description}</h5></Card.Title>
                      <Card.Text className="cartCost"> <p>{shoppingCart.quantities[index]} &emsp; for &emsp; ${convertDollar(product.cost * shoppingCart.quantities[index])}</p></Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <h3>Total:${convertDollar(shoppingCart.totalCost)} </h3>
            <Link to='/shopping-cart'><Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button></Link>
            <Button variant="primary" onClick={handlePurchaseCompletion}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
        <Form onSubmit={handleSubmit} className="container">
          <div>
            <Form.Group className="col-12 formText row">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                required
                className="creditForm"
                type="text"
                name="number"
                value={number}
                maxlength="16"
                placeholder="0000-0000-0000-0000"
                onChange={handleChangeNumber}
              />
            </Form.Group>
            <Form.Group className="row formText">
              <div className="col-3">
                <Form.Label>Month</Form.Label>
                <Form.Control
                  required
                  className="creditForm"
                  name="month"
                  value={month}
                  maxlength="2"
                  type="text"
                  placeholder="00"
                  onChange={handleChangeMonth}
                />
              </div>
              <div className="col-3">
                <Form.Label>Year</Form.Label>
                <Form.Control
                  required
                  className="creditForm"
                  name="year"
                  value={year}
                  type="text"
                  maxlength="4"
                  placeholder="0000"
                  onChange={handleChangeYear}
                />
              </div>
              <div className="col-3 formDiv">
                <Form.Label>Cvc Number</Form.Label>
                <Form.Control
                  className="creditForm"
                  required
                  name="cvc"
                  value={cvc}
                  type="text"
                  maxlength="4"
                  placeholder="000"
                  onChange={handleChangeCvc}
                />
              </div>
            </Form.Group>
          </div>
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
