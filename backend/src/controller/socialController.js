const { Social } = require('../_helper/db');

async function getSocials({ beta }) {
  const query = beta === '1' || beta === 1 ? {} : { deactivated: { $ne: true } };
  const socials = await Social.find(query).sort({ createdAt: -1 });
  if (!socials || socials.length === 0) {
    return { status: 404, message: 'Socials not found' };
  }
  return { status: 200, data: socials.map(social => social.toJSON()) };
}

async function createSocial(data) {
  try {
    const social = new Social(data);
    await social.save();
    return { status: 201, data: social.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function updateSocial({ id, ...data }) {
  try {
    const social = await Social.findById(id);
    if (!social) {
      return { status: 404, message: 'Social not found' };
    }
    Object.assign(social, data);
    await social.save();
    return { status: 200, data: social.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function deleteSocial({ id }) {
  try {
    const social = await Social.findByIdAndDelete(id);
    if (!social) {
      return { status: 404, message: 'Social not found' };
    }
    return { status: 200, message: 'Social deleted successfully' };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

module.exports = {
  getSocials,
  createSocial,
  updateSocial,
  deleteSocial,
};

