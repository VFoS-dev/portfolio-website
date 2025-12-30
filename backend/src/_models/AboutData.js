const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  text: [String],
}, { timestamps: true });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('AboutData', schema);

