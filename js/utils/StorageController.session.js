/**
 *
 * @flow
 */

export default /* StorageController = */ {
  async: 0,

  getItem(path: string): ?string {
    return sessionStorage.getItem(path);
  },

  setItem(path: string, value: string) {
    try {
      sessionStorage.setItem(path, value);
    } catch (e) {
      // Quota exceeded, possibly due to Safari Private Browsing mode
    }
  },

  removeItem(path: string) {
    sessionStorage.removeItem(path);
  },

  clear() {
    sessionStorage.clear();
  }
};

