const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Check if beta=1 is in the URL query parameters
function getBetaParam() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('beta') === '1';
}

async function fetchFromAPI(endpoint) {
  try {
    // Check if beta=1 is in the URL and append it to the endpoint
    const hasBeta = getBetaParam();
    let url = `${API_BASE_URL}/api/${endpoint}`;
    
    // Append beta=1 if present in browser URL
    if (hasBeta) {
      // Check if endpoint already has query parameters
      const separator = endpoint.includes('?') ? '&' : '?';
      url = `${url}${separator}beta=1`;
    }
    
    const response = await fetch(url);
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
