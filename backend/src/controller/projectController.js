const { Project } = require('../_helper/db');

async function getProjects() {
  const projects = await Project.find().sort({ cardNumber: -1 });
  if (!projects || projects.length === 0) {
    return { status: 404, message: 'Projects not found' };
  }
  return { status: 200, data: projects.map(project => project.toJSON()) };
}

module.exports = {
  getProjects,
};

