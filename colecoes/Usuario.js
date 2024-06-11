const mongoose = require("mongoose")

const Usuario = mongoose.model("Usuario", {
    email: String,
    senha: String
})

module.exports = Usuario