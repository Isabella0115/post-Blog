import { BaseApi } from "./base.js";
import { Storage } from "../utils/storage.js";

export class PostApi extends BaseApi {
  constructor(baseUrl) {
    super();
    this.baseUrl = baseUrl;
  }

  async getPosts() {
    try {
      const response = await fetch(this.getFullUrl("/posts"));
      if (response.status !== 200) {
        throw new Error("Failed to fetch posts");
      }
      return await response.json();
    } catch (error) {
      throw new Error("Error fetching posts");
    }
  }

  async getPostById(id) {
    try {
      if (!id) {
        throw new Error("Post ID is required");
      }

      const token = Storage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing. Please log in.");
      }

      const response = await fetch(this.getFullUrl(`/posts/${id}`), {
        method: "GET",
        headers: this.getAuthHeaders(token),
      });

      this.validateResponse(response);

      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Error fetching post");
    }
  }

  async create(post) {
    try {
      const token = Storage.getItem("token");
      const response = await fetch(this.getFullUrl("/posts"), {
        method: "POST",
        body: JSON.stringify(post),
        headers: this.getAuthHeaders(token),
      });

      this.validateResponse(response);
      return await response.json();
    } catch (error) {
      throw new Error("Error creating post");
    }
  }

  async update(id, post) {
    try {
      const token = Storage.getItem("token");
      const response = await fetch(this.getFullUrl(`/posts/${id}`), {
        method: "PUT",
        body: JSON.stringify(post),
        headers: this.getAuthHeaders(token),
      });

      this.validateResponse(response);
      return await response.json();
    } catch (error) {
      throw new Error("Error updating post");
    }
  }

  async delete(id) {
    try {
      const token = Storage.getItem("token");
      const response = await fetch(this.getFullUrl(`/posts/${id}`), {
        method: "DELETE",
        headers: this.getAuthHeaders(token),
      });

      this.validateResponse(response);
      return response;
    } catch (error) {
      throw new Error("Error deleting post");
    }
  }

  getFullUrl(endpoint) {
    return `${this.baseUrl}${endpoint}`;
  }

  getAuthHeaders(token) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }
}