const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const API_URL = process.env.VUE_APP_API_URL || '';

// В будущем можно на: !API_URL || process.env.NODE_ENV === 'development'
const USE_MOCKS = true; 

async function request(endpoint, mockFile) {
    try {
        if (USE_MOCKS) {
            // Имитация задержки
            await delay(300);
            const response = await fetch(`./${mockFile}`);
            
            if (!response.ok) {
                throw new Error(`Local: ${response.statusText}`);
            }
            
            return await response.json();
        } else {
            const response = await fetch(`${API_URL}/${endpoint}`);
            
            if (!response.ok) {
                throw new Error(`API: ${response.statusText}`);
            }
            
            return await response.json();
        }
    } catch (error) {
        console.error(`[${endpoint || mockFile}]:`, error);
        throw error;
    }
}

export const api = {
    getDistricts: () => request('districts.php', 'districts.json'),
    getObjects: () => request('objects.php', 'example_objects.json'),
    getCategoryGroups: () => request('category-group.php', 'example_category-group.json'),
    getLandCategories: () => request('available-land-categories.php', 'example_available-land-categories.json'),
    getTypeOfOwnership: () => request('type-of-ownership.php', 'example_type-of-ownership.json'),
};