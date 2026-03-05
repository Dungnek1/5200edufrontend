/**
 * Server-side HTTP client
 * Used in Next.js route handlers and server-side code
 * Must use explicit IP/hostname, not localhost
 */

import axios, { AxiosInstance } from 'axios';

const getServerBaseURL = (): string => {
  // NEXT_PUBLIC_API_URL is configured for client-side
  // For server-side, we need to use the actual BE server address
  const publicUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!publicUrl) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
  }

  // Replace localhost with the actual BE server IP from NEXT_PUBLIC_SITE_URL
  // NEXT_PUBLIC_SITE_URL format: http://103.72.56.121:5005
  // We extract the IP and construct the BE URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5005';
  
  try {
    const siteUrlObj = new URL(siteUrl);
    const hostname = siteUrlObj.hostname;
    
    // If NEXT_PUBLIC_API_URL contains localhost, replace with actual hostname
    if (publicUrl.includes('localhost')) {
      return publicUrl.replace('localhost', hostname);
    }
  } catch (err) {
    console.warn('Failed to parse NEXT_PUBLIC_SITE_URL, using NEXT_PUBLIC_API_URL as is');
  }
  
  return publicUrl;
};

const httpServer: AxiosInstance = axios.create({
  baseURL: getServerBaseURL(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Server-side requests don't send cookies automatically
});

export default httpServer;
