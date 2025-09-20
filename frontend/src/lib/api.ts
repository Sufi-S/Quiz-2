const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('access_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  // ✅ CHANGED: was `private`, now public
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = 'API request failed';
        try {
          const error = await response.json();
          errorMessage = error.msg || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        // If unauthorized, clear token
        if (response.status === 401) {
          this.clearToken();
        }
        
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    
    return response;
  }

  async register(name: string, email: string, password: string, role: string = 'student') {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  }

  async logout() {
    this.clearToken();
    return Promise.resolve();
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async verifyToken() {
    return this.request('/auth/verify-token', {
      method: 'POST',
    });
  }

  // Users endpoints
  async getUsers() {
    return this.request('/users');
  }

  // Quizzes endpoints
  async getQuizzes() {
    return this.request('/quizzes');
  }

  // Assignments endpoints
  async getAssignments() {
    return this.request('/assignments');
  }

  // Chat endpoints
  async getChats() {
    return this.request('/chat');
  }

  // Files endpoints
  async uploadFile(formData: FormData) {
    return this.request('/files/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Don't set Content-Type for FormData
    });
  }

  async getFiles() {
    return this.request('/files');
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const apiService = new ApiService();
