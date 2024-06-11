const mongoose = require("mongoose")

const Cota = mongoose.model("Cota", {
    fundoImob: String,
    valor: Number,
    tipo: String
})

module.exports = Cota