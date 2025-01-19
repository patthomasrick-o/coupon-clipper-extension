import IStorage from "../lib/IStorage";

/**
 * Controller for all storage for the app.
 */
export default class Storage implements IStorage {
  readSync<V>(): Promise<V>;
  readSync<V>(key: string): Promise<V>;
  async readSync<V>(key?: unknown): Promise<V> {
    if (typeof key === "string") {
      return new Promise((resolve) => {
        chrome.storage.sync.get(key, (result) => {
          resolve(result[key] as V);
        });
      });
    }
    throw new Error("Not implemented");
  }

  writeSync<V>(storage: V): Promise<void>;
  writeSync<V>(key: string, value: V): Promise<void>;
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

  writeLocal<V>(storage: V): Promise<void>;
  writeLocal<V>(key: string, value: V): Promise<void>;
  async writeLocal(key: unknown, value?: unknown): Promise<void> {
    if (typeof key === "string" && value !== undefined) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => {
          resolve();
        });
      });
    }
    throw new Error("Not implemented");
  }

  readLocal<V>(): Promise<V>;
  readLocal<V>(key: string): Promise<V>;
  async readLocal<V>(key?: unknown): Promise<V> {
    if (typeof key === "string") {
      return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
          resolve(result[key]);
        });
      });
    } else {
      return new Promise((resolve) => {
        chrome.storage.local.get(null, (result) => {
          resolve(result as V);
        });
      });
    }
    throw new Error("Not implemented");
  }
}
