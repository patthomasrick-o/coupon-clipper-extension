import IClipper from "../../lib/IClipper";

/** Query selector for unclipped coupons. */
const UNCLIPPED_QUERY =
  "cvs-coupon-container .coupon-action.button-blue.sc-send-to-card-action";

/** Query selector for all coupons. */
const ALL_QUERY = "cvs-coupon-container";

/** Delay between coupon clicks. */
const DELAY = 200; // Milliseconds.

export default class CvsExtraCareClipper implements IClipper {
  constructor() {
    console.debug("CvsExtraCareClipper.constructor");
  }

  /**
   * Discover all coupons by scrolling through the page until no new coupons are found.
   */
  async discoverCoupons() {
    let currentCouponCount = this.countAllCoupons();
    let discoveryCount = 0;
    while (discoveryCount < 20) {
      console.debug("discoveryCount round", discoveryCount);

      // Scroll to the last coupon container to trigger loading of more coupons.
      Array.from(document.querySelectorAll("cvs-coupon-container"))
        .reverse()[0]
        ?.scrollIntoView();

      // Wait for the page to load new coupons.
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Count the current number of coupons.
      let newCouponCount = this.countAllCoupons();

      // If the number of coupons has not changed, then we have reached the end of the page.
      if (newCouponCount <= currentCouponCount) break;

      // Update the current coupon count.
      currentCouponCount = newCouponCount;

      discoveryCount++;
    }
  }

  /**
   * Count the number of unclipped coupons.
   * @returns {number} The number of unclipped coupons.
   */
  countCoupons(): number {
    return document.querySelectorAll(UNCLIPPED_QUERY).length;
  }

  /**
   * Count the total number of coupons.
   * @returns {number} The total number of coupons.
   */
  countAllCoupons(): number {
    return document.querySelectorAll(ALL_QUERY).length;
  }

  /**
   * Get all unclipped coupons.
   * @returns {Element[]} An array of unclipped coupon elements.
   */
  getUnclippedCoupons(): Element[] {
    return Array.from(document.querySelectorAll(UNCLIPPED_QUERY));
  }

  /**
   * Remove all clipped coupons from the DOM.
   */
  cullClipped(): void {
    let elements = Array.from(
      document.querySelectorAll("cvs-coupon-container")
    );
    elements = elements.filter((e) => {
      return e.querySelector(".sc-on-card");
    });
    elements.forEach((e) => {
      e.remove();
    });

    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "instant",
    });
  }

  /**
   * Clip all available coupons by clicking on them.
   */
  async clipCoupons() {
    await this.discoverCoupons();

    // this.cullClipped();

    let coupons = this.getUnclippedCoupons();

    while (coupons.length > 0) {
      // Choose a random coupon.
      let index = Math.floor(Math.random() * coupons.length);
      let coupon = coupons[index];

      console.debug("Clicking", index, coupons.length, coupon);
      (coupon as HTMLElement).click();
      await new Promise((resolve) => setTimeout(resolve, DELAY));

      coupons = this.getUnclippedCoupons();
    }
  }
}
