import React, { useState, useEffect } from 'react'
import { getProducts, addToCart } from '../../api/products'
import { getHistory } from '../../api/shopping-cart'
import { withRouter } from 'react-router-dom'
import messages from '../AutoDismissAlert/messages'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
const ProductsPage = ({ user, msgAlert }) => {
  const [products, setProducts] = useState([])

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
  }, [])

  const onAddToCart = (event, product) => {
    // get all shopping carts belonging to current user
    getHistory(user)
      .then(data => {
        const carts = data.data.shoppingCart
        // find the current active cart
        const activeCart = carts.find(cart => cart.active)
        return activeCart
      })
      .then(activeCart => {
        console.log(product)
        addToCart(activeCart._id, product, user)
      })
      .catch(console.error)
  }

  const convertDollar = (num) => {
    const total = num * 0.01
    return total.toFixed(2)
  }

  const productsMap = products.map(product => (
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
  ))

  return (
    <div>
      <h2>Available Products</h2>
      <CardGroup>
        {productsMap}
      </CardGroup>
    </div>
  )
}

export default withRouter(ProductsPage)
