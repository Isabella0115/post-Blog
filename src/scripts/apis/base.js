export class BaseApi {
  validateResponse(response) {
    if (response.status === 401) {
      window.location.assign("/index.html");
      return false;
    }
  }
}
