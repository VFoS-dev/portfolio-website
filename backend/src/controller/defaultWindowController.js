const { DefaultWindow } = require('../_helper/db');

async function getDefaultWindow() {
  const data = await DefaultWindow.findOne().sort({ createdAt: -1 });
  if (!data) {
    return { status: 404, message: 'DefaultWindow not found' };
  }
  return { status: 200, data: data.toJSON() };
}

module.exports = {
  getDefaultWindow,
};

