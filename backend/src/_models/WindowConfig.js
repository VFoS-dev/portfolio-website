const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const iconSchema = new Schema({
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
}, { _id: false });

const schema = new Schema({
  icons: [iconSchema],
  defaultWindow: {
    iconTitle: String,
  },
}, { timestamps: true });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('WindowConfig', schema);

