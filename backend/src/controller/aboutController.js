const { AboutData } = require('../_helper/db');

async function getAbout({ beta }) {
  const query = beta === '1' || beta === 1 ? {} : { deactivated: { $ne: true } };
  const data = await AboutData.findOne(query).sort({ createdAt: -1 });
  if (!data) {
    return { status: 404, message: 'AboutData not found' };
  }
  return { status: 200, data: data.toJSON() };
}

async function createAbout(data) {
  try {
    const aboutData = new AboutData(data);
    await aboutData.save();
    return { status: 201, data: aboutData.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function updateAbout({ id, ...data }) {
  try {
    const aboutData = await AboutData.findById(id);
    if (!aboutData) {
      return { status: 404, message: 'AboutData not found' };
    }
    Object.assign(aboutData, data);
    await aboutData.save();
    return { status: 200, data: aboutData.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function deleteAbout({ id }) {
  try {
    const aboutData = await AboutData.findByIdAndDelete(id);
    if (!aboutData) {
      return { status: 404, message: 'AboutData not found' };
    }
    return { status: 200, message: 'AboutData deleted successfully' };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

module.exports = {
  getAbout,
  createAbout,
  updateAbout,
  deleteAbout,
};

