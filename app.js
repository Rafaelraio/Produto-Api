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
    throw new Error('Erro ao inserir produto')
  }
}

const getProducts = async () => {
    try {
      const products = await db.any('SELECT * FROM Produto')
      return products
    } catch (error) {
        console.log(error)
      throw new Error('Erro ao buscar produtos')
    }
  }  

  const getProductById = async (id) => {
    try {
      const products = await db.one('SELECT * FROM Produto Where ID=$1',[id])
      return products
    } catch (error) {
        console.log(error)
      throw new Error('Erro ao buscar produto')
    }
  } 

  const deleteProductById = async (id) => {
    try {
      const result = await db.result('DELETE FROM Produto Where ID=$1',[id])
      if (result.rowCount === 0) {
        throw new Error('Produto não encontrado');
      }
      return { message: 'Produto deletado' };
    } catch (error) {
        console.log(error)
      throw new Error('Erro ao deletar produto')
    }
  } 
  const updateProductById = async (id, descricao, preco, estoque, Adata) => {
    try {
      const result = await db.result('UPDATE Produto SET DESCRICAO = $2, PRECO = $3, ESTOQUE = $4, DATA = $5 WHERE ID = $1',[id, descricao, preco, estoque, Adata])
      if (result.rowCount === 0) {
        throw new Error('Produto não encontrado');
      }
      return { message: 'Produto atualizado' };
    } catch (error) {
        console.log(error)
      throw new Error('Erro ao atualizar produto')
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
    console.log(error)
      throw new Error('Erro ao inserir produto')
  }
})

app.get('/produto', async (req, res) => {
    try {
      const produtos = await getProducts()
      res.status(200).json(produtos)
    } catch (error) {
        console.log(error)
        throw new Error('Erro ao atualizar produto')
    }
  })


  app.get('/produto/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const produtos = await getProductById(id)
      res.status(200).json(produtos)
    } catch (error) {
        console.log(error)
        throw new Error('Erro ao buscar produto')
    }
  })

  app.delete('/produto/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const produtos = await deleteProductById(id)
      res.status(200).json(produtos)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

  app.put('/produto/:id', async (req, res) => {
    const { id } = req.params;
    const {descricao, preco, estoque, data } = req.body;
    try {
      const produtos = await updateProductById(id, descricao, preco, estoque, data)
      res.status(200).json(produtos)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

app.get('/', (req, res) => {
  res.send('Rotas que existem:\n/produto\n/produto/:id')
})

app.listen(port, () => {
  console.log(`Ouvindo nessa porta aqui: ${port}`)
})
