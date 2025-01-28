import { PostApi } from "./post.api.js";
import { UserApi } from "./user.api.js";
import { AuthApi } from "./auth.api.js";
import { FileUpload } from "./file-upload.api.js";

class Api {
  post = null;
  user = null;
  auth = null;
  fileUpload = null;

  constructor(baseUrl) {
      this.post = new PostApi(baseUrl);
      this.user = new UserApi(baseUrl);
      this.auth = new AuthApi(baseUrl);
      this.fileUpload = new FileUpload(baseUrl);
  }
}
export const api = new Api('https://simple-blog-api-red.vercel.app/api');
