const { AboutData } = require('../_helper/db');

async function getAbout() {
  const data = await AboutData.findOne().sort({ createdAt: -1 });
  if (!data) {
    return { status: 404, message: 'AboutData not found' };
  }
  return { status: 200, data: data.toJSON() };
}

module.exports = {
  getAbout,
};

