const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  text: String,
  deactivated: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('About', schema);

