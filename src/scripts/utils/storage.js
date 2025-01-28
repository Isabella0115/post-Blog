export class Storage {
  static getItem(key) {
    try {
      const value = localStorage.getItem(key);
      if (value === null) {
        return false;
      }
      return JSON.parse(value);
    } catch (error) {
      return false;
    }
  }
  static setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }
  static removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }
  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      return false;
    }
  }
}
