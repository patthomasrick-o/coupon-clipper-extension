export default interface ISingleton<T> {
  /**
   * Returns an instance of the implementing class.
   *
   * @returns {T} An instance of the implementing class.
   */
  inst(): T;
}
