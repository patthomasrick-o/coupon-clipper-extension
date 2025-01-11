export default interface IClipper {
  discoverCoupons(): void;

  countCoupons(): number;

  countAllCoupons(): number;

  getUnclippedCoupons(): Element[];

  clipCoupons(): void;
}
