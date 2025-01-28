export class AuthApi {
    constructor(baseUrl) {
      this.baseUrl = baseUrl;
    }
  
    async register(user) {
      try {
        const response = await fetch(`${this.baseUrl}/auth/register`, {
          method: "POST",
          body: JSON.stringify(user),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(errorDetails.message);
        }
        return await response.json();
      } catch {
        throw new Error("Registration failed");
      }
    }
  
    async login(credentials) {
      try {
        const response = await fetch(`${this.baseUrl}/auth/login`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: {
            "Content-Type": "application/json",
          },
        });
        return response.json();
      } catch {
        throw new Error("Login failed");
      }
    }
  }
  