import IStorage from "../lib/IStorage";

/**
 * Controller for all storage for the app.
 */
export default class Storage implements IStorage {
  readSync(): Promise<any>;
  readSync(key: string): Promise<any>;
  async readSync(key?: unknown): Promise<any> {
    if (typeof key === "string") {
      return new Promise((resolve) => {
        chrome.storage.sync.get(key, (result) => {
          resolve(result[key]);
        });
      });
    }
  }

  writeSync(storage: any): Promise<void>;
  writeSync(key: string, value: any): Promise<void>;
  async writeSync(key: unknown, value?: unknown): Promise<void> {
    if (typeof key === "string" && value !== undefined) {
      return new Promise((resolve) => {
        chrome.storage.sync.set({ [key]: value }, () => {
          resolve();
        });
      });
    } else if (typeof key === "object") {
      throw new Error("Not implemented");
    }
  }

  writeLocal(storage: any): Promise<void>;
  writeLocal(key: string, value: any): Promise<void>;
  async writeLocal(key: unknown, value?: unknown): Promise<void> {
    if (typeof key === "string" && value !== undefined) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => {
          resolve();
        });
      });
    } else if (typeof key === "object") {
      throw new Error("Not implemented");
    }
  }

  readLocal(): Promise<any>;
  readLocal(key: string): Promise<any>;
  async readLocal(key?: unknown): Promise<any> {
    if (typeof key === "string") {
      return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
          resolve(result[key]);
        });
      });
    } else {
      return new Promise((resolve) => {
        chrome.storage.local.get(null, (result) => {
          resolve(result);
        });
      });
    }
  }
}
