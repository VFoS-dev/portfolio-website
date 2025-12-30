const { Icon, DefaultWindow, AboutData, Project, Skill, Color, Social } = require('../_helper/db');

async function getIcons() {
  const icons = await Icon.find().sort({ createdAt: -1 });
  if (!icons || icons.length === 0) {
    return { status: 404, message: 'Icons not found' };
  }
  return { status: 200, data: icons.map(icon => icon.toJSON()) };
}

async function getDefaultWindow() {
  const data = await DefaultWindow.findOne().sort({ createdAt: -1 });
  if (!data) {
    return { status: 404, message: 'DefaultWindow not found' };
  }
  return { status: 200, data: data.toJSON() };
}

async function getAboutData() {
  const data = await AboutData.findOne().sort({ createdAt: -1 });
  if (!data) {
    return { status: 404, message: 'AboutData not found' };
  }
  return { status: 200, data: data.toJSON() };
}

async function getProjects() {
  const projects = await Project.find().sort({ cardNumber: -1 });
  if (!projects || projects.length === 0) {
    return { status: 404, message: 'Projects not found' };
  }
  return { status: 200, data: projects.map(project => project.toJSON()) };
}

async function getSkills() {
  const skills = await Skill.find().sort({ createdAt: -1 });
  if (!skills || skills.length === 0) {
    return { status: 404, message: 'Skills not found' };
  }
  return { status: 200, data: skills.map(skill => skill.toJSON()) };
}

async function getColors() {
  const colors = await Color.find().sort({ createdAt: -1 });
  if (!colors || colors.length === 0) {
    return { status: 404, message: 'Colors not found' };
  }
  return { status: 200, data: colors.map(color => color.toJSON()) };
}

async function getSocials() {
  const socials = await Social.find().sort({ createdAt: -1 });
  if (!socials || socials.length === 0) {
    return { status: 404, message: 'Socials not found' };
  }
  return { status: 200, data: socials.map(social => social.toJSON()) };
}

module.exports = {
  getIcons,
  getDefaultWindow,
  getAboutData,
  getProjects,
  getSkills,
  getColors,
  getSocials,
};

