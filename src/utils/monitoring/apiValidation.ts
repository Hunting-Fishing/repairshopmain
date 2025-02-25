
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

interface ValidationOptions {
  maxRetries?: number;
  timeout?: number;
  validateStatus?: (status: number) => boolean;
}

export class APIValidator {
  private retryCount: number = 0;
  private options: ValidationOptions;

  constructor(options: ValidationOptions = {}) {
    this.options = {
      maxRetries: 3,
      timeout: 5000,
      validateStatus: (status: number) => status >= 200 && status < 300,
      ...options
    };
  }

  async validateResponse(response: Response) {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  }

  handleError(error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        toast.error(`API Error: ${axiosError.response.status} - ${axiosError.response.statusText}`);
      } else if (axiosError.request) {
        toast.error('No response received from server');
      } else {
        toast.error('Error setting up request');
      }
    } else {
      toast.error('An unexpected error occurred');
    }
    throw error;
  }

  async withRetry<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (this.retryCount < (this.options.maxRetries || 3)) {
        this.retryCount++;
        const delay = Math.pow(2, this.retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.withRetry(fn);
      }
      throw error;
    }
  }
}

export const defaultValidator = new APIValidator();
