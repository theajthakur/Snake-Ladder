import axios, { AxiosError, AxiosInstance } from 'axios';

// Extend AxiosRequestConfig to include retry parameters
interface RetryConfig {
  retries?: number;
  retryDelay?: number;
  currentRetryCount?: number;
}

declare module 'axios' {
  export interface AxiosRequestConfig extends RetryConfig {}
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure retry defaults
const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000; // ms

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config;
    
    // If config is missing
    if (!config) {
      return Promise.reject(error);
    }

    // Initialize/update retry counters
    const retries = config.retries ?? DEFAULT_RETRIES;
    const currentRetryCount = config.currentRetryCount ?? 0;

    // Determine if we should retry:
    // Retry on network errors or 5xx Server Errors (excluding 4xx client errors)
    const isNetworkError = !error.response;
    const isServerError = error.response && error.response.status >= 500;

    if ((isNetworkError || isServerError) && currentRetryCount < retries) {
      config.currentRetryCount = currentRetryCount + 1;
      const delay = config.retryDelay ?? DEFAULT_RETRY_DELAY;
      
      // Exponential backoff
      const backoffDelay = delay * Math.pow(2, currentRetryCount);
      console.warn(`API Request failed (${error.message}). Retrying ${config.currentRetryCount}/${retries} after ${backoffDelay}ms...`);
      
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      return api(config);
    }

    // Standardized Error Handling
    let errorMessage = 'An unexpected error occurred';
    if (error.response) {
      const responseData = error.response.data as any;
      if (responseData && typeof responseData === 'object') {
        errorMessage = responseData.detail || responseData.message || errorMessage;
      } else {
        errorMessage = `Request failed with status code ${error.response.status}`;
      }
    } else if (error.request) {
      errorMessage = 'No response received from server. Please check your network connection.';
    } else {
      errorMessage = error.message;
    }

    // Return a custom standardized error structure
    const processedError = new Error(errorMessage);
    (processedError as any).status = error.response?.status;
    (processedError as any).originalError = error;

    return Promise.reject(processedError);
  }
);

export default api;
