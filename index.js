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

const crypto = require('crypto')
const Usuario = require('./colecoes/Usuario')
const criptografia = {
    algorithm: "aes256",
    secret: "chaves",
    type: "hex"
}

async function criptografar(senha) {
    return new Promise((resolve, reject) => {
        const gravarCriptografia = crypto.createCipher(criptografia.algorithm, criptografia.secret)
        let dadoEncriptado = '';

        gravarCriptografia.on('readable', () => {
            let bits
            while (null !== (bits = gravarCriptografia.read())) {
                dadoEncriptado += bits.toString(criptografia.type)
            }
        })

        gravarCriptografia.on('end', () => {
            resolve(dadoEncriptado)
        })

        gravarCriptografia.on('error', (error) => {
            reject(error)
        })

        gravarCriptografia.write(senha)
        gravarCriptografia.end()
    })
}

app.post('/usuarios', async (req, res) => {
    let { email, senha } = req.body

    try {
        let novaSenha = await criptografar(senha)
        const usuarios = { email, senha: novaSenha }
        await Usuario.create(usuarios)
        res.status(201).json({ Retorno: 'Usuário inserido no sistema' })
    } catch (error) {
        res.status(500).json({ Erro: error })
    }
})

app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find()
        res.status(200).json(usuarios)
    } catch (error) {
        res.status(500).json({ Erro: error })
    }
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