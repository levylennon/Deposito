const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Client = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
  CPF: {
    type: String,
    required: true,
  },
  Nickname: {
    type: String,
    required: true,
  },
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
  UpdatedAt: {
    type: Date,
    default: Date.now(),
  },
});

mongoose.model("client", Client);
