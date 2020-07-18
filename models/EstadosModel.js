const mongoose                          = require('mongoose');
const Schema                            = mongoose.Schema;

const cidade = new Schema({
    codigo_ibge: {
        type: Number,
        required: true
    },
    nome_municipio: {
        type: String,
        required: true
    }
})

const Estados = new Schema({
    uf: {
        type: String,
        required: true
    },
    sigla_uf:{
        type: String,
        required: true
    },
    nome_uf:{
        type: String,
        required: true
    },
    cidades: [cidade]


});

mongoose.model('estados', Estados);