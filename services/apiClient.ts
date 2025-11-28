/**
 * Custom Error class for API-related failures.
 * This class ensures that HTTP status and status text are available for error handling.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    // Calling the Error super constructor
    super(message);
    // Setting a custom name for easier identification
    this.name = "ApiError";
    // Fix for proper inheritance in TypeScript/Babel environments
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Configuration interface for the ApiClient.
 */
interface ApiConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * A type-safe API client built on the native fetch API with timeout,
 * error handling, and basic CRUD methods.
 */
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private headers: Record<string, string>;

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 10000;
    this.headers = {
      // Default header for JSON requests
      "Content-Type": "application/json",
      ...config.headers,
    };
  }

  /**
   * Private method to execute the fetch request with timeout and error handling.
   * @param endpoint - The API endpoint path.
   * @param options - Standard RequestInit options.
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    // Set a timeout to abort the request
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = `${this.baseURL}${endpoint}`;

      const config: RequestInit = {
        headers: this.headers,
        signal: controller.signal, // Use the signal for timeout
        ...options,
      };

      const response = await fetch(url, config);
      clearTimeout(timeoutId); // Clear the timeout if the request resolves/rejects before timeout

      if (!response.ok) {
        // Throw custom error for non-2xx HTTP status codes
        throw new ApiError(
          `API Error: ${response.status} ${response.statusText}`,
          response.status,
          response.statusText
        );
      }

      // Handle empty responses (e.g., 204 No Content, or when content-length is 0)
      const contentLength = response.headers.get("content-length");
      const isContentExpected =
        response.status !== 204 && response.status !== 205;

      if (!isContentExpected || contentLength === "0") {
        return {} as T; // Return an empty object (or null, depending on your convention)
      }

      // Attempt to parse JSON response body
      return await response.json();
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      // Re-throw if it's already a controlled API error
      if (error instanceof ApiError) {
        throw error;
      }

      // --- FIX for TypeScript Error TS2339 ---
      // Safely check if the error is an object with a 'name' property
      if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        (error as { name: string }).name === "AbortError"
      ) {
        throw new ApiError("Request timeout");
      }

      // Handle generic network errors or other unknown exceptions
      throw new ApiError(
        error instanceof Error ? error.message : "Network error occurred"
      );
    }
  }

  // --- Public HTTP Methods ---

  get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request<T>(`${endpoint}${queryString}`);
  }

  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Create API client instance
export const apiClient = new ApiClient({
  baseURL: "https://dummyjson.com",
  timeout: 15000,
});
