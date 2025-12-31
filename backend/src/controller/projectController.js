const mongoose = require('mongoose');
const { Project, Company, Skill } = require('../_helper/db');

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

/**
 * Resolves an array of skills to MongoDB ObjectIds
 * If a skill is already a valid ObjectId, returns it
 * If a skill is a string (name), finds the skill by name and returns its ID
 * Filters out null/undefined/empty values
 */
async function resolveSkills(skills) {
  if (!skills || !Array.isArray(skills)) {
    return [];
  }

  const resolvedSkills = await Promise.all(
    skills.map(async (skill) => {
      // Handle null, undefined, or empty string
      if (!skill || skill === '') {
        return null;
      }

      // Check if it's already a valid MongoDB ObjectId
      if (mongoose.Types.ObjectId.isValid(skill)) {
        // Verify the skill exists
        const existingSkill = await Skill.findById(skill);
        if (existingSkill) {
          return skill;
        }
        // If ObjectId is valid but skill doesn't exist, return null (will be filtered)
        return null;
      }

      // If it's not an ObjectId, treat it as a skill name and find by name
      const foundSkill = await Skill.findOne({ name: skill });
      if (!foundSkill) {
        console.warn(`Skill "${skill}" not found`);
        return null;
      }
      return foundSkill._id;
    })
  );

  // Filter out null values
  return resolvedSkills.filter(skill => skill !== null);
}

async function getProjects({ beta }) {
  const query = beta === '1' || beta === 1 ? {} : { deactivated: { $ne: true } };
  const projects = await Project.find(query).populate('company').populate('stack').sort({ cardNumber: -1 });
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
    
    // Resolve skill names to IDs if needed
    if (data.stack !== undefined && Array.isArray(data.stack)) {
      data.stack = await resolveSkills(data.stack);
    }
    
    const project = new Project(data);
    await project.save();
    await project.populate('company');
    await project.populate('stack');
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
    
    // Resolve skill names to IDs if needed
    if (data.stack !== undefined && Array.isArray(data.stack)) {
      data.stack = await resolveSkills(data.stack);
    }
    
    Object.assign(project, data);
    await project.save();
    await project.populate('company');
    await project.populate('stack');
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

