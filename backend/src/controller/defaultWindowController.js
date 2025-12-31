const { DefaultWindow } = require('../_helper/db');

async function getDefaultWindow({ beta }) {
  const query = beta === '1' || beta === 1 ? {} : { deactivated: { $ne: true } };
  const data = await DefaultWindow.findOne(query).sort({ createdAt: -1 });
  if (!data) {
    return { status: 404, message: 'DefaultWindow not found' };
  }
  return { status: 200, data: data.toJSON() };
}

async function createDefaultWindow(data) {
  try {
    // Ensure only one default window exists - use findOneAndUpdate with upsert
    const defaultWindow = await DefaultWindow.findOneAndUpdate(
      {}, // Empty filter to find any existing default window
      data,
      { 
        upsert: true, // Create if doesn't exist
        new: true, // Return the updated document
        setDefaultsOnInsert: true // Set defaults on insert
      }
    );
    return { status: 201, data: defaultWindow.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function updateDefaultWindow(data) {
  try {
    // Update the single default window entry (no ID needed)
    const defaultWindow = await DefaultWindow.findOneAndUpdate(
      {}, // Empty filter to find the single default window entry
      data,
      { 
        new: true, // Return the updated document
        upsert: true // Create if doesn't exist (shouldn't happen but safety)
      }
    );
    if (!defaultWindow) {
      return { status: 404, message: 'DefaultWindow not found' };
    }
    return { status: 200, data: defaultWindow.toJSON() };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function deleteDefaultWindow() {
  try {
    // Don't actually delete - just deactivate
    // Since there should only be one, we'll just deactivate it
    const defaultWindow = await DefaultWindow.findOneAndUpdate(
      {},
      { deactivated: true },
      { new: true }
    );
    if (!defaultWindow) {
      return { status: 404, message: 'DefaultWindow not found' };
    }
    return { status: 200, message: 'DefaultWindow deactivated successfully' };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

module.exports = {
  getDefaultWindow,
  createDefaultWindow,
  updateDefaultWindow,
  deleteDefaultWindow,
};

