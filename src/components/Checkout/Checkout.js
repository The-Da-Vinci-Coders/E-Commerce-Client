import React, { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import StipeCheckoutForm from './CheckoutForm'
import messages from '../AutoDismissAlert/messages'
import { getHistory } from '../../api/shopping-cart'
import { deepIndexOf } from '../../lib/deep-index-of'

const Checkout = ({ user, msgAlert, customer }) => {
  const [shoppingCart, setShoppingCart] = useState({
    products: [],
    totalCost: 0
  })

  const onShipSubmit = event => {
    event.preventDefault()
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
  }, [])

  return (
    <div>
      <Accordion defaultActiveKey="0">
        <Card>
          <Card.Header className="title">
        Billing Information
          </Card.Header>
          <Accordion.Collapse eventKey="0" className="container formText">
            <Card.Body><Form onSubmit={onShipSubmit} className="formText">
              <div className="row">
                <Form.Group controlId="formBasicAddress" className="col-8">
                  <Form.Label>Name</Form.Label>
                  <Form.Control className="creditForm" type="text" placeholder="Your Name" />
                </Form.Group>
                <Form.Group controlId="formBasicAddress" className="col-12">
                  <Form.Label>Address</Form.Label>
                  <Form.Control className="creditForm col-12 addressMargin" type="text" placeholder="Line 1" />
                </Form.Group>
                <Form.Group controlId="formBasicAddress" className="col-12">
                  <Form.Control className="creditForm col-12" type="text" placeholder="Line 2" />
                </Form.Group>
              </div>
              <div className="row">
                <Form.Group controlId="formBasicCity" className="col-6">
                  <Form.Label>City</Form.Label>
                  <Form.Control className="creditForm" type="text" placeholder="City" />
                </Form.Group>
                <Form.Group controlId="formBasicState" className="col-3 states">
                  <Form.Label>State</Form.Label>
                  <Form.Control className="creditForm" as="select">
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District Of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formBasicZipCode" className="col-3">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control className="creditForm" type="number" placeholder="Zip Code" />
                </Form.Group>
              </div>
              <div className="row">
                <Form.Group controlId="formBasicPhoneNumber" className="col-6">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control className="creditForm" type="tel" placeholder="Phone Number" />
                </Form.Group>
              </div>
              <div className="row billingButton">
                <Form.Group className="col-12">
                  <Accordion.Toggle className="uglyButton" eventKey="1">
                    <Accordion.Toggle className="uglyButton" eventKey="0"><Button className="goodButton" variant="primary" type="submit">
                    Submit
                    </Button>
                    </Accordion.Toggle>
                  </Accordion.Toggle>
                </Form.Group>
              </div>
            </Form></Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Card.Header>
              Payment Information
          </Card.Header>
          <Accordion.Collapse eventKey="1">
            <Card.Body>
              <StipeCheckoutForm
                shoppingCart={shoppingCart}
                user={user}
                customer={customer}
                msgAlert={msgAlert}
              /> </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  )
}

export default Checkout
