const { Icon } = require('../_helper/db');

async function getIcons({ beta }) {
  const query = beta === '1' || beta === 1 ? {} : { deactivated: { $ne: true } };
  const icons = await Icon.find(query).sort({ createdAt: -1 });
  if (!icons || icons.length === 0) {
    return { status: 404, message: 'Icons not found' };
  }
  return { status: 200, data: icons.map(icon => icon.toJSON()) };
}

async function createIcon(data) {
  try {
    const icon = new Icon(data);
    await icon.save();
    return { status: 201, data: icon.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function updateIcon({ id, ...data }) {
  try {
    const icon = await Icon.findById(id);
    if (!icon) {
      return { status: 404, message: 'Icon not found' };
    }
    Object.assign(icon, data);
    await icon.save();
    return { status: 200, data: icon.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function deleteIcon({ id }) {
  try {
    const icon = await Icon.findByIdAndDelete(id);
    if (!icon) {
      return { status: 404, message: 'Icon not found' };
    }
    return { status: 200, message: 'Icon deleted successfully' };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

module.exports = {
  getIcons,
  createIcon,
  updateIcon,
  deleteIcon,
};

