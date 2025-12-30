const { Skill } = require('../_helper/db');

async function getSkills() {
  const skills = await Skill.find().sort({ createdAt: -1 });
  if (!skills || skills.length === 0) {
    return { status: 404, message: 'Skills not found' };
  }
  return { status: 200, data: skills.map(skill => skill.toJSON()) };
}

module.exports = {
  getSkills,
};

