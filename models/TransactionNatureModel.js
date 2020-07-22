const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Options = new Schema({
  Billing: {
    type: Boolean
  },
  Stock: {
    type: Boolean
  }
})

const TransactionNature = new Schema({
  Description: {
    type: String,
    required: true,
  },
  Transition: {
    type: String,
    required: true,
  },
  Options:{ Options },
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
  UpdatedAt: {
    type: Date,
  },
});

mongoose.model("transactionNature", TransactionNature);
