require('dotenv').config({ path: __dirname + '/../../.env' });
const { env } = require('../_helper/env');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Import models
const Icon = require('../_models/Icon');
const DefaultWindow = require('../_models/DefaultWindow');
const About = require('../_models/About');
const Project = require('../_models/Project');
const Skill = require('../_models/Skill');
const Saber = require('../_models/Saber');
const Social = require('../_models/Social');
const User = require('../_models/User');
const Company = require('../_models/Company');

// Connect to database
const mongoUrl = env("MongoDB_URL", 'mongodb://127.0.0.1:27017/Portfolio');
mongoose.connect(mongoUrl).then(async () => {
  console.log("Connected to Database");
  
  // Read JSON files from seed folder
  const seedJsonPath = path.join(__dirname, '../seed');
  
  try {
    // Seed Icons
    const iconsArray = JSON.parse(fs.readFileSync(path.join(seedJsonPath, 'icons.json'), 'utf8'));
    await Icon.deleteMany({});
    await Icon.insertMany(iconsArray);
    console.log('✓ Seeded Icons');
    
    // Seed DefaultWindow
    const defaultWindowData = JSON.parse(fs.readFileSync(path.join(seedJsonPath, 'defaultWindow.json'), 'utf8'));
    await DefaultWindow.deleteMany({});
    await DefaultWindow.create(defaultWindowData);
    console.log('✓ Seeded DefaultWindow');
    
    // Seed About
    const aboutData = JSON.parse(fs.readFileSync(path.join(seedJsonPath, 'about.json'), 'utf8'));
    await About.deleteMany({});
    await About.create(aboutData);
    console.log('✓ Seeded About');
    
    // Seed Companies (must be before Projects since Projects reference Companies)
    const companiesArray = JSON.parse(fs.readFileSync(path.join(seedJsonPath, 'companies.json'), 'utf8'));
    await Company.deleteMany({});
    const insertedCompanies = await Company.insertMany(companiesArray);
    console.log('✓ Seeded Companies');

    // Seed Skills (must be before Projects since Projects reference Skills)
    const skillsArray = JSON.parse(fs.readFileSync(path.join(seedJsonPath, 'skills.json'), 'utf8'));
    await Skill.deleteMany({});
    await Skill.insertMany(skillsArray);
    console.log('✓ Seeded Skills');
    
    // Helper function to resolve company name to ObjectId
    const resolveCompany = async (companyName) => {
      if (!companyName || companyName === '') {
        return null;
      }
      
      // Check if it's already a valid MongoDB ObjectId
      if (mongoose.Types.ObjectId.isValid(companyName)) {
        const existingCompany = await Company.findById(companyName);
        if (existingCompany) {
          return companyName;
        }
        throw new Error(`Company with ID ${companyName} not found`);
      }
      
      // Find company by name
      const foundCompany = await Company.findOne({ name: companyName });
      if (!foundCompany) {
        throw new Error(`Company "${companyName}" not found`);
      }
      return foundCompany._id;
    };
    
    // Seed Projects - convert company names and skill names to IDs
    const projectsArray = JSON.parse(fs.readFileSync(path.join(seedJsonPath, 'projectsData.json'), 'utf8'));
    
    // Helper to resolve skill name to ID for seeding
    const resolveSkillForSeed = async (skillName) => {
      if (!skillName) return null;
      const foundSkill = await Skill.findOne({ name: skillName });
      if (!foundSkill) {
        console.warn(`Skill "${skillName}" not found during project seeding. Project will be created without this skill reference.`);
        return null;
      }
      return foundSkill._id;
    };
    
    // Convert company names and skill names to ObjectIds
    const projectsWithIds = await Promise.all(
      projectsArray.map(async (project) => {
        // Convert company
        if (project.company) {
          project.company = await resolveCompany(project.company);
        }
        // Convert stack (skills)
        if (project.stack && Array.isArray(project.stack)) {
          project.stack = await Promise.all(
            project.stack.map(skillName => resolveSkillForSeed(skillName))
          );
          // Filter out null values
          project.stack = project.stack.filter(id => id !== null);
        }
        return project;
      })
    );
    
    await Project.deleteMany({});
    await Project.insertMany(projectsWithIds);
    console.log('✓ Seeded Projects');
    
    // Seed Sabers
    const sabersArray = JSON.parse(fs.readFileSync(path.join(seedJsonPath, 'sabers.json'), 'utf8'));
    await Saber.deleteMany({});
    await Saber.insertMany(sabersArray);
    console.log('✓ Seeded Sabers');
    
    // Seed Socials
    const socialsArray = JSON.parse(fs.readFileSync(path.join(seedJsonPath, 'socialsData.json'), 'utf8'));
    await Social.deleteMany({});
    await Social.insertMany(socialsArray);
    console.log('✓ Seeded Socials');
    
    // Seed Admin User
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const adminUser = new User({
        username: 'admin',
        password: 'password', // Will be hashed by the pre-save hook
      });
      await adminUser.save();
      console.log('✓ Seeded Admin User (username: admin, password: password)');
    } else {
      console.log('✓ Admin User already exists');
    }
    
    console.log('\n✅ All data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}).catch((err) => {
  console.log("Not Connected to Database ERROR! ", err);
  process.exit(1);
});

