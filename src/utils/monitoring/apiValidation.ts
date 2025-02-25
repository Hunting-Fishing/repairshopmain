
import { AxiosError } from 'axios';
import { toast } from 'sonner';

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
    if (error instanceof AxiosError) {
      if (error.response) {
        toast.error(`API Error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
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
