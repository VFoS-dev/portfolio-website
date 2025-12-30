const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function fetchFromAPI(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/data/${endpoint}`);
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

export async function getColors() {
  return await fetchFromAPI('colors');
}

export async function getAbout() {
  const aboutData = await fetchFromAPI('about');
  return aboutData.text.join('\n');
}

export async function getIcons() {
  return await fetchFromAPI('icons');
}

export async function getDefaultWindow() {
  return await fetchFromAPI('default-window');
}


export async function getProjects() {
  return await fetchFromAPI('projects');
}

export async function getSocials() {
  return await fetchFromAPI('socials');
}
