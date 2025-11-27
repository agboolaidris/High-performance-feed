class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private headers: Record<string, string>;

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 10000;
    this.headers = {
      "Content-Type": "application/json",
      ...config.headers,
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = `${this.baseURL}${endpoint}`;

      const config: RequestInit = {
        headers: this.headers,
        signal: controller.signal,
        ...options,
      };

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiError(
          `API Error: ${response.status} ${response.statusText}`,
          response.status,
          response.statusText
        );
      }

      // Handle empty responses
      const contentLength = response.headers.get("content-length");
      if (contentLength === "0") {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error?.name === "AbortError") {
        throw new ApiError("Request timeout");
      }

      throw new ApiError(
        error instanceof Error ? error.message : "Network error occurred"
      );
    }
  }

  get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
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
