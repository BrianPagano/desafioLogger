const mongoose = require('mongoose');

const purchaseCollection = 'purchase';

const purchaseSchema = new mongoose.Schema({
  code: String,
  purchase_datetime: {
      type: Date,
      default: () => {
          const now = new Date();
          // Ajustar la fecha y hora a la zona horaria de Argentina
          now.setUTCHours(now.getUTCHours() - 3);
          return now;
      }
  },
  amount: Number,
  purchaser: String,
})

const Purchase = mongoose.model(purchaseCollection, purchaseSchema);

module.exports = Purchase;
