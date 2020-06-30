import React, { useState, Fragment } from 'react'
import { Route, Redirect } from 'react-router-dom'

import AuthenticatedRoute from '../AuthenticatedRoute/AuthenticatedRoute'
import AutoDismissAlert from '../AutoDismissAlert/AutoDismissAlert'
import Header from '../Header/Header'
import SignUp from '../SignUp/SignUp'
import SignIn from '../SignIn/SignIn'
import SignOut from '../SignOut/SignOut'
import ChangePassword from '../ChangePassword/ChangePassword'
import ProductsPage from '../Products/ProductsPage'
import SearchProducts from '../Products/SearchProducts'
import Checkout from '../Checkout/Checkout'
import CurrentShoppingCart from '../ShoppingCart/CurrentShoppingCart'
import ShoppingHistory from '../ShoppingHistory/ShoppingHistory'
// import Checkout from '../Checkout/Checkout'

const App = () => {
  const [user, setUser] = useState(null)
  const [customer, setCustomer] = useState(null)
  const [msgAlerts, setMsgAlerts] = useState([])
  const [search, setSearch] = useState('')
  const [isGuest, setIsGuest] = useState(false)

  const clearUser = () => {
    setUser(null)
    setIsGuest(false)
  }

  const msgAlert = ({ heading, message, variant }) => {
    setMsgAlerts([...msgAlerts, { heading, message, variant }])
  }

  return (
    <Fragment>
      <Header user={user} setIsGuest={setIsGuest}/>
      {msgAlerts.map((msgAlert, index) => (
        <AutoDismissAlert
          key={index}
          heading={msgAlert.heading}
          variant={msgAlert.variant}
          message={msgAlert.message}
        />
      ))}
      <main className="container bodyContainer" >
        <Redirect from="/" to="/products" />
        <AuthenticatedRoute exact path='/shopping-cart' user={user} render={() => (
          <CurrentShoppingCart msgAlert={msgAlert} user={user}/>
        )} />
        <AuthenticatedRoute path='/checkout' user={user} render={() => (
          <Checkout msgAlert={msgAlert} user={user} customer={customer}/>
        )} />
        <Route path='/products' render={() => (
          <ProductsPage msgAlert={msgAlert} user={user} setSearch={setSearch}/>
        )} />
        <Route path='/search-products' render={() => (
          <SearchProducts msgAlert={msgAlert} user={user} search={search} setSearch={setSearch}/>
        )} />
        <Route path='/sign-up' render={() => (
          <SignUp msgAlert={msgAlert} setUser={setUser} setCustomer={setCustomer}/>
        )} />
        <Route path='/sign-in' render={() => (
          <SignIn msgAlert={msgAlert} setUser={setUser} setCustomer={setCustomer} isGuest={isGuest}/>
        )} />
        <AuthenticatedRoute user={user} path='/sign-out' render={() => (
          <SignOut msgAlert={msgAlert} clearUser={clearUser} user={user} customer={customer} setCustomer={setCustomer}/>
        )} />
        <AuthenticatedRoute user={user} path='/change-password' render={() => (
          <ChangePassword msgAlert={msgAlert} user={user}/>
        )} />
        <AuthenticatedRoute user={user} path='/get-history' render={() => (
          <ShoppingHistory msgAlert={msgAlert} user={user} />
        )} />
      </main>
    </Fragment>
  )
}

export default App
