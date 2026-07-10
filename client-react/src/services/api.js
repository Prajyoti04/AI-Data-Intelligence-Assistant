// src/services/api.js

// Use Vite env var so production deployments can point to the correct backend.
// In Vercel, set VITE_API_BASE_URL to your Render backend base URL.
// Example: https://ai-data-intelligence-assistant.onrender.com
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ai-data-intelligence-assistant.onrender.com";

export default API_BASE_URL;
