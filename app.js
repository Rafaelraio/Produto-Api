const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:root@localhost:5436/product-api?schema=public');

const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

const insertProduct = async (descricao, preco, estoque, Adata) => {
    console.log(Adata)
  try {
    const data = await db.one(
      'INSERT INTO Produto (DESCRICAO, PRECO, ESTOQUE, DATA) VALUES ($1, $2, $3, $4) RETURNING ID, DESCRICAO, PRECO, ESTOQUE, DATA',
      [descricao, preco, estoque, Adata]
    )
    console.log(preco)
    return data
  } catch (error) {
    console.log(error)
    throw new Error('Erro ao inserir produto: ' + error.message)
  }
}

const getProducts = async () => {
    try {
      const products = await db.any('SELECT * FROM Produto')
      return products
    } catch (error) {
        console.log(error)
      throw new Error('Erro ao buscar produtos: ')
    }
  }  

app.post('/produto', async (req, res) => {
  const { descricao, preco, estoque, data } = req.body
  try {
    const novoProduto = await insertProduct(descricao, preco, estoque, data)
    res.status(201).json({
      message: 'Produto inserido',
      produto: novoProduto,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get('/produto', async (req, res) => {
    try {
      const produtos = await getProducts()
      res.status(200).json(produtos)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

app.get('/', (req, res) => {
  res.send('Rotas que existem:\n /produto')
})

app.listen(port, () => {
  console.log(`Ouvindo nessa porta aqui: ${port}`)
})
