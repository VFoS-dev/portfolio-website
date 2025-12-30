const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: String,
  href: String,
  gif: String,
  ring: String,
  shadow: String,
  upper: {
    fill: String,
    stroke: String,
  },
  lower: {
    fill: String,
    stroke: String,
  },
  deactivated: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Social', schema);

