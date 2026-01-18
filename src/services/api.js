// API Configuration and Service Layer
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Generic request handler
  async request(endpoint, options = {}) {
    // Recovery: ensure token is in memory if it exists in localStorage
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }

    console.log(`[DEBUG] apiService.token state: ${this.token ? 'Present' : 'Missing'}`);
    if (!this.token) {
      console.warn(`[WARNING] No token found in memory or localStorage for request to ${endpoint}`);
    }

    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      console.log(`[DEBUG] API Request to: ${this.baseURL}${endpoint}`, options);
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong');
        }
        return data;
      } else {
        const text = await response.text();
        console.error(`[CRITICAL] API returned non-JSON response from ${endpoint}:`, text);
        throw new Error(`Server returned non-JSON response (${response.status}). Check console for details.`);
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    this.clearToken();
    return { success: true };
  }

  // Chat & AI Response endpoints
  async sendMessage(message, conversationId = null) {
    return this.request('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, conversationId }),
    });
  }

  async getConversationHistory(conversationId) {
    // Implement or leave placeholder if not ready
    // return this.request(`/chat/history/${conversationId}`);
    return [];
  }

  // Academic Guidance endpoints
  async getAcademicPrograms(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.request(`/academic/programs?${queryString}`);
  }

  async getCourseRecommendations(userProfile) {
    // Placeholder
    return [];
  }

  // Career Advisory endpoints
  async getCareerPaths(field = '') {
    return this.request(`/career/paths?field=${field}`);
  }

  async getCareerDetails(careerId) {
    return this.request(`/career/details/${careerId}`);
  }

  // Learning Resources endpoints
  async getLearningResources(topic) {
    return this.request(`/learning/resources?topic=${topic}`);
  }

  // User Profile endpoints
  async getUserProfile() {
    return this.request('/user/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getQuickActionResponse(action) {
    // For now, map quick actions to normal messages if the format differs
    return this.sendMessage(action);
  }

  // Assessment endpoints
  async getAssessments() {
    return this.request('/assessment');
  }

  async getAssessment(id) {
    return this.request(`/assessment/${id}`);
  }

  async submitAssessment(assessmentId, answers) {
    return this.request('/assessment/submit', {
      method: 'POST',
      body: JSON.stringify({ assessmentId, answers }),
    });
  }

  // Admin Module Endpoints
  async getKB() {
    return this.request('/admin/kb');
  }

  async addKBEntry(entry) {
    return this.request('/admin/kb', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  }

  async updateKBEntry(id, entry) {
    return this.request(`/admin/kb/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entry),
    });
  }

  async deleteKBEntry(id) {
    return this.request(`/admin/kb/${id}`, {
      method: 'DELETE',
    });
  }

  async getUnresolvedFeedback() {
    return this.request('/admin/feedback');
  }

  async resolveFeedback(id) {
    return this.request(`/admin/feedback/resolve/${id}`, {
      method: 'POST',
    });
  }

  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getAnalyticsData() {
    return this.request('/analytics');
  }

  // Auth Reset Flow
  async requestPasswordReset(email) {
    return this.request('/auth/request-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyResetCode(email, code) {
    return this.request('/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  }

  async resetPassword(email, code, newPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, newPassword }),
    });
  }
}

const apiService = new ApiService();
export default apiService;