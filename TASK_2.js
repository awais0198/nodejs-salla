const express = require('express')
const app = express()
const db = require('./db')

app.get('/product/:productId', (req, res) => {
  const productId = req.params.productId

  const query = 'SELECT * FROM products WHERE id = ?'

  db.query(query, [productId], (err, result) => {
    if (err) {
      console.error('Database query error:', err)
      return res.status(500).send('Internal Server Error')
    }

    if (result.length === 0) return res.status(404).send('Product not found')

    res.status(200).json(result)
  })
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})


// Key Changes:
//     Parameterized Query to prevents SQL injection.
//     Logging errors and return a 500 status for server errors.
//     Added Status Codes:
//        404 if the product is not found.
//        200 for successful retrieval.