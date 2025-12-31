const { About } = require('../_helper/db');

async function getAbout({ beta }) {
  const query = beta === '1' || beta === 1 ? {} : { deactivated: { $ne: true } };
  const data = await About.findOne(query).sort({ createdAt: -1 });
  if (!data) {
    return { status: 404, message: 'About not found' };
  }
  return { status: 200, data: data.toJSON() };
}

async function createAbout(data) {
  try {
    const about = new About(data);
    await about.save();
    return { status: 201, data: about.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function updateAbout({ id, ...data }) {
  try {
    const about = await About.findById(id);
    if (!about) {
      return { status: 404, message: 'About not found' };
    }
    Object.assign(about, data);
    await about.save();
    return { status: 200, data: about.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function deleteAbout({ id }) {
  try {
    const about = await About.findByIdAndDelete(id);
    if (!about) {
      return { status: 404, message: 'About not found' };
    }
    return { status: 200, message: 'About deleted successfully' };
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

