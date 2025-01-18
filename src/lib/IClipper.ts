export default interface IClipper {
  /**
   * Discovers available coupons.
   * This method should be called to find and list all the coupons that can be clipped.
   */
  discoverCoupons(): void;

  /**
   * Counts the number of coupons that have been clipped.
   *
   * @returns {number} The number of clipped coupons.
   */
  countCoupons(): number;

  /**
   * Counts the total number of coupons, both clipped and unclipped.
   *
   * @returns {number} The total number of coupons.
   */
  countAllCoupons(): number;

  /**
   * Retrieves all the coupons that have not been clipped yet.
   *
   * @returns {Element[]} An array of elements representing the unclipped coupons.
   */
  getUnclippedCoupons(): Element[];

  /**
   * Clips all available coupons.
   * This method should be called to clip all the discovered coupons.
   */
  clipCoupons(): void;
}
