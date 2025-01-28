import { Storage } from "../utils/storage.js";
import { BaseApi } from "./base.js";

export class UserApi extends BaseApi {
  constructor(baseUrl) {
    super();
    this.baseUrl = baseUrl;
  }

  async getUser() {
    try {
      const token = Storage.getItem("token");
      const response = await fetch(this.getFullUrl("/users"), {
        headers: this.getAuthHeaders(token),
      });

      this.validateResponse(response);

      if (response.status !== 200) {
        throw new Error(response.statusText);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error; 
    }
  }

  getFullUrl(endpoint) {
    return `${this.baseUrl}${endpoint}`;
  }

  getAuthHeaders(token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
}