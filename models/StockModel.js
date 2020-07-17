const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Stock = new Schema({
  Operation: {
    type: String,
    required: true,
    default: "E",
  },
  Quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
});

mongoose.model("stock", Stock);
