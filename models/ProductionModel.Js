const mongoose = require("mongoose");
const { ObjectID } = require("bson");
const Schema = mongoose.Schema;

const Status = new Schema({
  Status: {
    type: String,
    required: true,
  },
  CreatedAt: {
    type: Date,
    default: Date.now(),
  }
});

const Product = new Schema({
  DescriptionProduct: {
    type: String,
    required: true,
  },
  IdProduct: {
    type: String,
    required: true,
  },
  Image: {
    type: Buffer,
  },
  ProductQuantity: {
    type: Number,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Type: {
    type: String,
    required: true,
  },
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Production = new Schema({
  AdressDelivery: {
    type: String,
  },
  Client: {
    type: ObjectID,
    required: true,
  },
  Priority: {
    type: String,
    required: true,
  },
  StartDate: {
    type: Date,
    required: true,
  },
  DeliveryDate: {
    type: Date,
    required: true,
  },
  User:{
    type: ObjectID
  },
  Product: [Product],
  Status: Status,
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
  UpdatedAt: {
    type: Date,
    default: Date.now(),
  },
});

mongoose.model("production", Production);
