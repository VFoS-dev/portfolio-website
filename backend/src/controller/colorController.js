const { Color } = require('../_helper/db');

async function getColors() {
  const colors = await Color.find().sort({ createdAt: -1 });
  if (!colors || colors.length === 0) {
    return { status: 404, message: 'Colors not found' };
  }
  return { status: 200, data: colors.map(color => color.toJSON()) };
}

async function createColor(data) {
  try {
    const color = new Color(data);
    await color.save();
    return { status: 201, data: color.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function updateColor({ id, ...data }) {
  try {
    const color = await Color.findById(id);
    if (!color) {
      return { status: 404, message: 'Color not found' };
    }
    Object.assign(color, data);
    await color.save();
    return { status: 200, data: color.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function deleteColor({ id }) {
  try {
    const color = await Color.findByIdAndDelete(id);
    if (!color) {
      return { status: 404, message: 'Color not found' };
    }
    return { status: 200, message: 'Color deleted successfully' };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

module.exports = {
  getColors,
  createColor,
  updateColor,
  deleteColor,
};

