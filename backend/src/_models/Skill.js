const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  group: String,
  name: String,
  percent: Number,
  icon: { type: String, default: '' },
  deactivated: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Skill', schema);

