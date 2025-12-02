const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
  name: String,
  list: String // 'Today' o 'Work'
});
module.exports = mongoose.model('Item', itemSchema);
