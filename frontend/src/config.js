const config = {
    API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    // Helper to get full API path
    getApiUrl: (path) => {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        // Remove leading slash from path if present to avoid double slashes
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${baseUrl}/${cleanPath}`;
    }
};

export default config;
