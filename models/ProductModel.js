const mongoose = require("mongoose");
const { ObjectID } = require("bson");
const { stringify } = require("querystring");
const Schema = mongoose.Schema;

const Recipe = new Schema({
  IdFeedstock: {
    type: String,
    required: true,
  },
  NameFeedStock: {
    type: String,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  AbbreviationMeasure: {
    type: String
  }
});

const Stock = new Schema({
  IdProduction: {
    type: ObjectID,
  },
  Operation: {
    type: String,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  Motive: {
    type: String,
    required: true,
  },
  User: {
    type: String,
    required: true,
  },
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Product = new Schema({
  Description: {
    type: String,
    required: true,
  },
  Barcode: {
    type: String,
  },
  Value: {
    type: Number,
    required: true,
    default: 0,
  },
  Measure: {
    type: ObjectID,
    required: true,
  },
  Type: {
    type: String,
    required: true,
  },
  Stock: [Stock],
  Recipe: [Recipe],
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
  UpdatedAt: {
    type: Date,
    default: Date.now(),
  },
});

mongoose.model("product", Product);
