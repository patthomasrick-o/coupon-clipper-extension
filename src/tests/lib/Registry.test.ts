import * as _ from "lodash";
import Registry from "../../lib/Registry";
import RegistrySpy from "../../lib/RegistrySpy";

describe("Registry", () => {
  describe("inst", () => {
    test("should return instance of Registry", () => {
      expect(new Registry().inst()).toBeInstanceOf(Registry);
    });

    test("should return the same instance always", () => {
      const instance1 = new Registry().inst();
      const instance2 = new Registry().inst();

      expect(instance1).toBe(instance2);
    });
  });

  describe("set", () => {
    test("should set a value", () => {
      const registry = new Registry().inst();
      registry.set("key", "test-value");

      expect(
        _.get((new Registry().inst() as RegistrySpy).registry, "key")
      ).toBe("test-value");
    });
  });

  describe("get", () => {
    test("should get a value", () => {
      (new Registry().inst() as RegistrySpy).registry = { "test-key": "123" };

      expect(new Registry().inst().get("test-key")).toBe("123");
    });
  });
});
