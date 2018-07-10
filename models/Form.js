const mongoose = require('mongoose');
const FormSchema = new mongoose.Schema({
  formName: String,
  sessionId: String,
  currentPage: Number,
  totalPages: Number,
  data: Array
});
module.exports = mongoose.model('Form', FormSchema);
