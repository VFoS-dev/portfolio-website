const { Company, Project } = require('../_helper/db');

async function getCompanies({ beta }) {
  const query = beta === '1' || beta === 1 ? {} : { deactivated: { $ne: true } };
  const companies = await Company.find(query).sort({ name: 1 });
  if (!companies || companies.length === 0) {
    return { status: 404, message: 'Companies not found' };
  }
  
  // Get usage count for each company
  const companiesWithUsage = await Promise.all(
    companies.map(async (company) => {
      const usageCount = await Project.countDocuments({ company: company._id });
      const companyData = company.toJSON();
      companyData.usageCount = usageCount;
      return companyData;
    })
  );
  
  return { status: 200, data: companiesWithUsage };
}

async function createCompany(data) {
  try {
    const company = new Company(data);
    await company.save();
    return { status: 201, data: company.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function updateCompany({ id, ...data }) {
  try {
    const company = await Company.findById(id);
    if (!company) {
      return { status: 404, message: 'Company not found' };
    }
    Object.assign(company, data);
    await company.save();
    return { status: 200, data: company.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function deleteCompany({ id }) {
  try {
    const company = await Company.findById(id);
    if (!company) {
      return { status: 404, message: 'Company not found' };
    }
    
    // Check if company is used in any projects
    const usageCount = await Project.countDocuments({ company: id });
    if (usageCount > 0) {
      return { 
        status: 400, 
        message: `Cannot delete company. It is currently used in ${usageCount} project(s). Please remove the company from all projects before deleting.` 
      };
    }
    
    await Company.findByIdAndDelete(id);
    return { status: 200, message: 'Company deleted successfully' };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

module.exports = {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
};

