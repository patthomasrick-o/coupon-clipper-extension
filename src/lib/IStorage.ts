/**
 * Interface: controller for all storage for the app.
 */
export default interface Storage {
  /** Read all extension storage for this extension from the sync store. */
  readSync<V>(): Promise<V>;

  /** Read a specific key from the sync store. */
  readSync<V>(key: string): Promise<V>;

  /** Write all extension storage for this extension to the sync store. */
  writeSync<V>(storage: V): Promise<void>;

  /** Write a specific key to the sync store. */
  writeSync<V>(key: string, value: V): Promise<void>;

  /** Read all extension storage for this extension from the local store. */
  readLocal<V>(): Promise<V>;

  /** Read a specific key from the local store. */
  readLocal<V>(key: string): Promise<V>;

  /** Write all extension storage for this extension to the local store. */
  writeLocal<V>(storage: V): Promise<void>;

  /** Write a specific key to the local store. */
  writeLocal<V>(key: string, value: V): Promise<void>;
}
