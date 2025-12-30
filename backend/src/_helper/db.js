const mongoose = require('mongoose');
const { env } = require('./env');

mongoose.connect(env("MongoDB_URL", 'mongodb://127.0.0.1:27017/Portfolio')).then(() => {
  console.log("Connected to Database");
}).catch((err) => {
  console.log("Not Connected to Database ERROR! ", err);
});

mongoose.Promise = global.Promise;

module.exports = {
  _template: require('../_models/_template'),
  Icon: require('../_models/Icon'),
  DefaultWindow: require('../_models/DefaultWindow'),
  AboutData: require('../_models/AboutData'),
  Project: require('../_models/Project'),
  Skill: require('../_models/Skill'),
  Color: require('../_models/Color'),
  Social: require('../_models/Social'),
  User: require('../_models/User'),
};