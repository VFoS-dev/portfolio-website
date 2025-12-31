const { Saber } = require('../_helper/db');

async function getSabers({ beta }) {
  const query = beta === '1' || beta === 1 ? {} : { deactivated: { $ne: true } };
  const sabers = await Saber.find(query).sort({ createdAt: -1 });
  if (!sabers || sabers.length === 0) {
    return { status: 404, message: 'Sabers not found' };
  }
  return { status: 200, data: sabers.map(saber => saber.toJSON()) };
}

async function createSaber(data) {
  try {
    const saber = new Saber(data);
    await saber.save();
    return { status: 201, data: saber.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function updateSaber({ id, ...data }) {
  try {
    const saber = await Saber.findById(id);
    if (!saber) {
      return { status: 404, message: 'Saber not found' };
    }
    Object.assign(saber, data);
    await saber.save();
    return { status: 200, data: saber.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function deleteSaber({ id }) {
  try {
    const saber = await Saber.findByIdAndDelete(id);
    if (!saber) {
      return { status: 404, message: 'Saber not found' };
    }
    return { status: 200, message: 'Saber deleted successfully' };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

module.exports = {
  getSabers,
  createSaber,
  updateSaber,
  deleteSaber,
};

