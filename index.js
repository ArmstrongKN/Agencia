const express = require('express')
const mongoose = require('mongoose')
const app = express()

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: 'Olá, Express!'})
})

const Cota = require('./colecoes/Cota')

app.post('/cotas', async (req, res) => {
    const { fundoImob, valor, tipo } = req.body
    const cotas = { fundoImob, valor, tipo }

    try {
        await Cota.create(cotas)
        res.status(201).json({ Retorno: "Cota inserida com sucesso" })
    } catch (error) {
        res.status(500).json({ Erro: error })
    }
})

app.get('/cotas', async (req, res) => {
    try {
        const cotas = await Cota.find()
        res.status(200).json(cotas)
    } catch (error) {
        res.status(500).json({ Erro: error })
    }
})

app.get('/cotas/:fundoImob', async (req, res) => {
    const fundoImobiliario = req.params.fundoImob

    try {
        const cotas = await Cota.findOne({ fundoImob: fundoImobiliario })

        if (!cotas) {
            res.status(422).json({ Retorno: 'Cota não encontrada para leitura' })
            return
        }

        res.status(200).json(cotas)
    } catch (error) {
        res.status(500).json({ Erro: error })
    }
})

app.patch('/cotas/:fundoImob', async (req, res) => {
    const fundoImobiliario = req.params.fundoImob
    const { fundoImob, valor, tipo } = req.body
    const cotas = { fundoImob, valor, tipo }

    try {
        const cotaAtualizada = await Cota.updateOne({ fundoImob: fundoImobiliario }, cotas)
    
        if (cotaAtualizada.matchedCount === 0) {
          res.status(422).json({ Retorno: 'Cota não encontrada para alterar' })
          return
        }
    
        res.status(200).json(cotas)
      } catch (error) {
        res.status(500).json({ Retorno: error })
      }
})

app.delete('/cotas/:fundoImob', async (req, res) => {
    const fundoImobiliario = req.params.fundoImob
    const cotas = await Cota.findOne({ fundoImob: fundoImobiliario })

    if (!cotas) {
        res.status(442).json({ Retorno: 'Cota não encontrada para excluir' })
        return
    }

    try {
        await Cota.deleteOne({ fundoImob: fundoImobiliario })

        res.status(200).json({ Retorno: 'Cota excluída com sucesso'} )
    } catch (error) {
        res.status(500).json({ Erro: error })
    }
})

mongoose.connect("mongodb://localhost:27017/").then(() => {
    console.log("Conectamos ao MongoDB")
    app.listen(3000)
})
.catch((err) => {
    console.log(err)
})