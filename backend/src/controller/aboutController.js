const { About } = require('../_helper/db');

async function getAbout({ beta }) {
  const query = beta === '1' || beta === 1 ? {} : { deactivated: { $ne: true } };
  const data = await About.findOne(query).sort({ createdAt: -1 });
  if (!data) {
    return { status: 404, message: 'About not found' };
  }
  return { status: 200, data: data.toJSON() };
}

async function createAbout(data) {
  try {
    // Ensure only one about entry exists - use findOneAndUpdate with upsert
    const about = await About.findOneAndUpdate(
      {}, // Empty filter to find any existing about
      data,
      { 
        upsert: true, // Create if doesn't exist
        new: true, // Return the updated document
        setDefaultsOnInsert: true // Set defaults on insert
      }
    );
    return { status: 201, data: about.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function updateAbout(data) {
  try {
    // Update the single about entry (no ID needed)
    const about = await About.findOneAndUpdate(
      {}, // Empty filter to find the single about entry
      data,
      { 
        new: true, // Return the updated document
        upsert: true // Create if doesn't exist (shouldn't happen but safety)
      }
    );
    if (!about) {
      return { status: 404, message: 'About not found' };
    }
    return { status: 200, data: about.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function deleteAbout() {
  try {
    // Don't actually delete - just deactivate or clear the text
    // Since there should only be one, we'll just deactivate it
    const about = await About.findOneAndUpdate(
      {},
      { deactivated: true },
      { new: true }
    );
    if (!about) {
      return { status: 404, message: 'About not found' };
    }
    return { status: 200, message: 'About deactivated successfully' };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

module.exports = {
  getAbout,
  createAbout,
  updateAbout,
  deleteAbout,
};

