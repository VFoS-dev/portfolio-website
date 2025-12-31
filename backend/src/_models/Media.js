const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  filename: String,
  originalName: String,
  url: String, // S3 URL
  type: String, // 'image', 'video', 'other'
  mimeType: String,
  size: Number, // File size in bytes
  path: String, // Original path in public folder (for seeding)
}, { timestamps: true });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Media', schema);

