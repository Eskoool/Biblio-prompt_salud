// Vercel Serverless Function - Re-export backend Express app
import app from '../backend/src/server';

// Vercel will automatically handle the Express app
export default app;
