const mongoose = require('mongoose');
const { env } = require('./env');

mongoose.connect(env("MongoDB_URL", 'mongodb://127.0.0.1:27017/DeerFlatRanch')).then(() => {
  console.log("Connected to Database");
}).catch((err) => {
  console.log("Not Connected to Database ERROR! ", err);
});

mongoose.Promise = global.Promise;

module.exports = {
  _template: require('../_models/_template'),
};