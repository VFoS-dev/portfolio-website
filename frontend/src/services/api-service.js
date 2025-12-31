const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function fetchFromAPI(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

export async function getSkills() {
  return await fetchFromAPI('skills');
}

export async function getSabers() {
  return await fetchFromAPI('sabers');
}

export async function getAbout() {
  const aboutData = await fetchFromAPI('about');
  return aboutData.text || '';
}

export async function getIcons() {
  return await fetchFromAPI('icons');
}

export async function getDefaultWindow() {
  try {
    const data = await fetchFromAPI('default-window');
    return data || {};
  } catch (error) {
    console.error('Error fetching default window:', error);
    return {};
  }
}


export async function getProjects() {
  return await fetchFromAPI('projects');
}

export async function getSocials() {
  return await fetchFromAPI('socials');
}
