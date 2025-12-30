const { Skill } = require('../_helper/db');

async function getSkills({ beta }) {
  const query = beta === '1' || beta === 1 ? {} : { deactivated: { $ne: true } };
  const skills = await Skill.find(query).sort({ createdAt: -1 });
  if (!skills || skills.length === 0) {
    return { status: 404, message: 'Skills not found' };
  }
  return { status: 200, data: skills.map(skill => skill.toJSON()) };
}

async function createSkill(data) {
  try {
    const skill = new Skill(data);
    await skill.save();
    return { status: 201, data: skill.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function updateSkill({ id, ...data }) {
  try {
    const skill = await Skill.findById(id);
    if (!skill) {
      return { status: 404, message: 'Skill not found' };
    }
    Object.assign(skill, data);
    await skill.save();
    return { status: 200, data: skill.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function deleteSkill({ id }) {
  try {
    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) {
      return { status: 404, message: 'Skill not found' };
    }
    return { status: 200, message: 'Skill deleted successfully' };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};

