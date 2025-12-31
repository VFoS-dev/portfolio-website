const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  id: String,
  title: String,
  img: String,
  description: String,
  stack: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
  keyFeatures: [String],
  startDate: String,
  endDate: String,
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
  },
  type: String,
  secondaryType: String,
  links: Schema.Types.Mixed,
  cardNumber: Number,
  deprecated: Boolean,
  rarity: String,
  deactivated: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Project', schema);

