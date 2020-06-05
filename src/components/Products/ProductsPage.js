import React, { useState, useEffect } from 'react'
import { getProducts, addToCart } from '../../api/products'
import { getHistory } from '../../api/shopping-cart'
import { withRouter, Redirect } from 'react-router-dom'
import messages from '../AutoDismissAlert/messages'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import Form from 'react-bootstrap/Form'
const ProductsPage = ({ user, msgAlert, setSearch }) => {
  const [products, setProducts] = useState([])
  const [isSearch, setIsSearch] = useState(false)
  const [localSearch, setLocalSearch] = useState('')

  useEffect(() => {
    getProducts()
      .then(currProducts => {
        setProducts(currProducts.data.products)
      })
      .catch(() => {
        msgAlert({
          heading: 'Product Search Failed',
          message: messages.getProductsFailure,
          variant: 'danger'
        })
      })
  }, [isSearch])

  const onAddToCart = (event, product) => {
    // get all shopping carts belonging to current user
    getHistory(user)
      .then(data => {
        const carts = data.data.shoppingCart
        // find the current active cart
        const activeCart = carts.find(cart => cart.active)
        console.log(product)
        addToCart(activeCart._id, product, user)
      })
      .catch(console.error)
  }

  const convertDollar = (num) => {
    const total = num * 0.01
    return total.toFixed(2)
  }

  const handleChange = event => {
    setLocalSearch(event.target.value)
  }

  const onSubmit = event => {
    event.preventDefault()
    console.log(localSearch)
    setSearch(localSearch)
    setIsSearch(true)
  }

  if (!isSearch) {
    return (
      <div>
        <h2>Available Products</h2>
        <Form inline onSubmit={onSubmit}>
          <Form.Control type="text" placeholder="Search" onChange={handleChange} value={localSearch} />
          <Button type="submit" variant="outline-info">Search</Button>
        </Form>
        <CardGroup>
          {products.map(product => (
            <div key={product._id}>
              <Card style={{ width: '18rem' }} >
                <Card.Img variant="top" src={product.imageURL} />
                <Card.Body>
                  <Card.Title><h3>{product.name}</h3></Card.Title>
                  <h4> ${convertDollar(product.cost)} </h4>
                  <p>{product.description}</p>
                  <h6>Category: {product.category}</h6>
                  <Button onClick={() => onAddToCart(event, product)}>Add To Cart</Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </CardGroup>
      </div>
    )
  } else {
    return (
      <Redirect to="/search-products"/>
    )
  }
}

export default withRouter(ProductsPage)
