const mongoose = require('mongoose');
const { Project, Company } = require('../_helper/db');

/**
 * Resolves company field to a MongoDB ObjectId
 * If company is already a valid ObjectId, returns it
 * If company is a string (name), finds the company by name and returns its ID
 * If company is null/undefined/empty, returns null
 */
async function resolveCompany(company) {
  // Handle null, undefined, or empty string
  if (!company || company === '') {
    return null;
  }

  // Check if it's already a valid MongoDB ObjectId
  if (mongoose.Types.ObjectId.isValid(company)) {
    // Verify the company exists
    const existingCompany = await Company.findById(company);
    if (existingCompany) {
      return company;
    }
    // If ObjectId is valid but company doesn't exist, return error
    throw new Error(`Company with ID ${company} not found`);
  }

  // If it's not an ObjectId, treat it as a company name and find by name
  const foundCompany = await Company.findOne({ name: company });
  if (!foundCompany) {
    throw new Error(`Company "${company}" not found`);
  }
  return foundCompany._id;
}

async function getProjects({ beta }) {
  const query = beta === '1' || beta === 1 ? {} : { deactivated: { $ne: true } };
  const projects = await Project.find(query).populate('company').sort({ cardNumber: -1 });
  if (!projects || projects.length === 0) {
    return { status: 404, message: 'Projects not found' };
  }
  return { status: 200, data: projects.map(project => project.toJSON()) };
}

async function createProject(data) {
  try {
    // Resolve company name to ID if needed
    if (data.company !== undefined) {
      data.company = await resolveCompany(data.company);
    }
    
    const project = new Project(data);
    await project.save();
    await project.populate('company');
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
    
    // Resolve company name to ID if needed
    if (data.company !== undefined) {
      data.company = await resolveCompany(data.company);
    }
    
    Object.assign(project, data);
    await project.save();
    await project.populate('company');
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

