import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import CheckoutForm from './CheckoutForm'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const Checkout = ({ user, msgAlert, shoppingCart }) => {
  const stripePromise = loadStripe('pk_test_UAYhjaj3nMDpJIFaSleA1hk100LECO92t8')

  const onShipSubmit = event => {
    event.preventDefault()
  }

  return (
    <div>
      <Accordion defaultActiveKey="0">
        <Card>
          <Card.Header>
        Billing Information
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body><Form onSubmit={onShipSubmit}>
              <Form.Group controlId="formBasicAddress">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Line 1" />
              </Form.Group>
              <Form.Group controlId="formBasicAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" placeholder="Line 1" />
                <Form.Control type="text" placeholder="Line 2" />
              </Form.Group>
              <Form.Group controlId="formBasicCity">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" placeholder="City" />
              </Form.Group>
              <Form.Group controlId="formBasicState">
                <Form.Control as="select">
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
              <Form.Group controlId="formBasicZipCode">
                <Form.Label>Zip Code</Form.Label>
                <Form.Control type="number" placeholder="Zip Code" />
              </Form.Group>
              <Form.Group controlId="formBasicPhoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="tel" placeholder="Phone Number" />
              </Form.Group>
              <Accordion.Toggle eventKey="1">
                <Accordion.Toggle eventKey="0"><Button variant="primary" type="submit">
              Submit
                </Button>
                </Accordion.Toggle>
              </Accordion.Toggle>
            </Form></Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Card.Header>
              Payment Information
          </Card.Header>
          <Accordion.Collapse eventKey="1">
            <Card.Body><Elements stripe={stripePromise}>
              <CheckoutForm
                shoppingCart={shoppingCart}
              />
            </Elements></Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  )
}

export default Checkout
