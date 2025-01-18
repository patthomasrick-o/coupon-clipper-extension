/**
 * Interface: controller for all storage for the app.
 */
export default interface Storage {
  /** Read all extension storage for this extension from the sync store. */
  readSync(): Promise<any>;

  /** Read a specific key from the sync store. */
  readSync(key: string): Promise<any>;

  /** Write all extension storage for this extension to the sync store. */
  writeSync(storage: any): Promise<void>;

  /** Write a specific key to the sync store. */
  writeSync(key: string, value: any): Promise<void>;

  /** Read all extension storage for this extension from the local store. */
  readLocal(): Promise<any>;

  /** Read a specific key from the local store. */
  readLocal(key: string): Promise<any>;

  /** Write all extension storage for this extension to the local store. */
  writeLocal(storage: any): Promise<void>;

  /** Write a specific key to the local store. */
  writeLocal(key: string, value: any): Promise<void>;
}
