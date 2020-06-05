import React, { useState, useEffect } from 'react'
import { getProducts, addToCart } from '../../api/products'
import { getHistory } from '../../api/shopping-cart'
import { withRouter } from 'react-router-dom'
import messages from '../AutoDismissAlert/messages'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import Form from 'react-bootstrap/Form'

const SearchProducts = ({ search, user, msgAlert, setSearch }) => {
  const [products, setProducts] = useState([])
  const [localSearch, setLocalSearch] = useState('')
  const [reloadResults, setReloadResults] = useState(false)

  useEffect(() => {
    getProducts()
      .then(data => {
        const products = data.data.products
        console.log(products)
        console.log(search)
        const searchQuery = search.toUpperCase()
        const queries = searchQuery.split(' ')
        const result = []
        for (let i = 0; i < products.length; i++) {
          const currProduct = products[i]
          const nameTracker = []
          // create an array of the words in the title of the current product
          const nameWords = currProduct.name.split(' ')
          // loop through title words
          for (let z = 0; z < nameWords.length; z++) {
            const currNameWord = nameWords[z].toUpperCase()
            // if the title word matches one of the queries, mark it in the titleTracker
            for (let q = 0; q < queries.length; q++) {
              const currQuery = queries[q]
              if (currNameWord.includes(currQuery)) {
                nameTracker[q] = true
              }
            }
          }
          // check titleTracker to see if it has the same length as queries
          if (nameTracker.length === queries.length) {
            // check that no indices are empty
            if (!(nameTracker.includes(undefined))) {
              // this recipe qualifies, add it
              result.push(currProduct)
            }
          }
        }
        setProducts(result)
      })
      .catch(() => {
        msgAlert({
          heading: 'Product Search Failed',
          message: messages.getProductsFailure,
          variant: 'danger'
        })
      })
  }, [reloadResults])

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
    setSearch(localSearch)
    setReloadResults(!reloadResults)
  }

  return (
    <div>
      <h2>Search Results</h2>
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
                {user && <Button onClick={() => onAddToCart(event, product)}>Add To Cart</Button>}
              </Card.Body>
            </Card>
          </div>
        ))}
      </CardGroup>
    </div>
  )
}

export default withRouter(SearchProducts)
