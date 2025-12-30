const { Color } = require('../_helper/db');

async function getColors() {
  const colors = await Color.find().sort({ createdAt: -1 });
  if (!colors || colors.length === 0) {
    return { status: 404, message: 'Colors not found' };
  }
  return { status: 200, data: colors.map(color => color.toJSON()) };
}

module.exports = {
  getColors,
};

