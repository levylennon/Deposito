const mongoose = require("mongoose");
const { ObjectID } = require("bson");
const { stringify } = require("querystring");
const Schema = mongoose.Schema;

const Products = new Schema({
  CodProduct: {
    type: ObjectID,
  },
  CodSupplier: {
    type: Number,
  },
});
const Supplier = new Schema({
  Tipo: {
    type: String,
    required: true,
  },
  RazaoSocial: {
    type: String,
    required: true,
  },
  NomeFantasia: {
    type: String,
  },
  CNPJ: {
    type: String,
    required: true,
  },
  InscEstadual: {
    type: String,
  },
  InscMun: {
    type: String,
  },
  Celular: {
    type: String,
  },
  CelularAlt: {
    type: String,
  },
  Email: {
    type: String,
  },
  CEP: {
    type: String,
    required: true,
  },
  Logradouro: {
    type: String,
    required: true,
  },
  Numero: {
    type: String,
  },
  Complemento: {
    type: String,
  },
  Bairro: {
    type: String,
  },
  Estado: {
    type: String,
    required: true,
  },
  Cidade: {
    type: String,
    required: true,
  },
  Produtos: [Products],
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
  UpdatedAt: {
    type: Date,
  },
});

mongoose.model("supplier", Supplier);
