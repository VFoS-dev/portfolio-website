const { DefaultWindow } = require('../_helper/db');

async function getDefaultWindow() {
  const data = await DefaultWindow.findOne().sort({ createdAt: -1 });
  if (!data) {
    return { status: 404, message: 'DefaultWindow not found' };
  }
  return { status: 200, data: data.toJSON() };
}

async function createDefaultWindow(data) {
  try {
    const defaultWindow = new DefaultWindow(data);
    await defaultWindow.save();
    return { status: 201, data: defaultWindow.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function updateDefaultWindow({ id, ...data }) {
  try {
    const defaultWindow = await DefaultWindow.findById(id);
    if (!defaultWindow) {
      return { status: 404, message: 'DefaultWindow not found' };
    }
    Object.assign(defaultWindow, data);
    await defaultWindow.save();
    return { status: 200, data: defaultWindow.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function deleteDefaultWindow({ id }) {
  try {
    const defaultWindow = await DefaultWindow.findByIdAndDelete(id);
    if (!defaultWindow) {
      return { status: 404, message: 'DefaultWindow not found' };
    }
    return { status: 200, message: 'DefaultWindow deleted successfully' };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

module.exports = {
  getDefaultWindow,
  createDefaultWindow,
  updateDefaultWindow,
  deleteDefaultWindow,
};

