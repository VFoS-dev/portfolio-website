const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  title: String,
  'desktop-icon': String,
  icon: String,
  app: String,
  x: String,
  y: String,
  width: String,
  height: String,
  isTrash: Boolean,
  appProps: Schema.Types.Mixed,
  deactivated: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Icon', schema);

