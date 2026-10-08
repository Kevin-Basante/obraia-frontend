// Backend URL: comes from VITE_API_URL (.env file locally, project settings on Vercel).
// Only public values go here: secrets never reach the frontend.
export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/+$/, '')
