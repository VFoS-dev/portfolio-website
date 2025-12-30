const { Project } = require('../_helper/db');

async function getProjects({ beta }) {
  const query = beta === '1' || beta === 1 ? {} : { deactivated: { $ne: true } };
  const projects = await Project.find(query).sort({ cardNumber: -1 });
  if (!projects || projects.length === 0) {
    return { status: 404, message: 'Projects not found' };
  }
  return { status: 200, data: projects.map(project => project.toJSON()) };
}

async function createProject(data) {
  try {
    const project = new Project(data);
    await project.save();
    return { status: 201, data: project.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function updateProject({ id, ...data }) {
  try {
    const project = await Project.findById(id);
    if (!project) {
      return { status: 404, message: 'Project not found' };
    }
    Object.assign(project, data);
    await project.save();
    return { status: 200, data: project.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function deleteProject({ id }) {
  try {
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return { status: 404, message: 'Project not found' };
    }
    return { status: 200, message: 'Project deleted successfully' };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};

