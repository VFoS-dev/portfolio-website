const { Social } = require('../_helper/db');

async function getSocials() {
  const socials = await Social.find().sort({ createdAt: -1 });
  if (!socials || socials.length === 0) {
    return { status: 404, message: 'Socials not found' };
  }
  return { status: 200, data: socials.map(social => social.toJSON()) };
}

module.exports = {
  getSocials,
};

