const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  lightColor: String,
  auraColor: String,
  innerColor: String,
  textColor: String,
  deactivated: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Color', schema);

