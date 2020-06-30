import React, { useState, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'

import { signIn } from '../../api/auth'
import messages from '../AutoDismissAlert/messages'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const SignIn = ({ isGuest, msgAlert, history, setUser, setCustomer }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEmailChange = event => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  const onSignIn = event => {
    event.preventDefault()
    signIn(email, password)
      .then(res => {
        setUser(res.data.user)
        return res.data.user.stripeId
      })
      .then(stripeId => {
        setCustomer(stripeId)
      })
      .then(() => msgAlert({
        heading: 'Sign In Success',
        message: messages.signInSuccess,
        variant: 'success'
      }))
      .then(() => history.push('/products'))
      .catch(error => {
        setEmail('')
        setPassword('')
        msgAlert({
          heading: 'Sign In Failed with error: ' + error.message,
          message: messages.signInFailure,
          variant: 'danger'
        })
      })
  }

  useEffect(() => {
    if (isGuest) {
      setEmail('guest@guest.com')
      setPassword('ggggg')
    }
  }, [])

  return (
    <div className="row">
      <div className="col-sm-10 col-md-8 mx-auto mt-5">
        <h3 className="title">Sign In</h3>
        <Form onSubmit={onSignIn}>
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              required
              type="email"
              name="email"
              value={email}
              placeholder="Enter email"
              onChange={handleEmailChange}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              name="password"
              value={password}
              type="password"
              placeholder="Password"
              onChange={handlePasswordChange}
            />
          </Form.Group>
          <p> New to Homepage Depot? <Link to="/sign-up">Sign Up Here</Link></p>
          <Button
            variant="primary"
            type="submit"
          >
            Submit
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default withRouter(SignIn)
