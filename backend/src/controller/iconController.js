const { Icon } = require('../_helper/db');

async function getIcons() {
  const icons = await Icon.find().sort({ createdAt: -1 });
  if (!icons || icons.length === 0) {
    return { status: 404, message: 'Icons not found' };
  }
  return { status: 200, data: icons.map(icon => icon.toJSON()) };
}

module.exports = {
  getIcons,
};

