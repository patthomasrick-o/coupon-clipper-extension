/**
 * Interface representing a registry for storing and retrieving values.
 * Provides methods to get and set values associated with specific keys.
 */
export default interface IRegistry {
  /**
   * Retrieves a value from the registry.
   *
   * @param k - The key associated with the value to retrieve.
   * @returns The value associated with the specified key.
   */
  get<V>(k: string): V;

  /**
   * Sets a value in the registry.
   *
   * @param k - The key to associate with the value.
   * @param v - The value to store in the registry.
   */
  set<V>(k: string, v: V): void;
}
