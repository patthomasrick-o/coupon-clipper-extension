import * as _ from "lodash";
import Registry from "../../lib/Registry";
import RegistrySpy from "../../lib/RegistrySpy";

describe("Registry", () => {
  describe("inst", () => {
    test("should return instance of Registry", () => {
      expect(new Registry().inst()).toBeInstanceOf(Registry);
    });

    test("should return the same instance always", () => {
      let instance1 = new Registry().inst();
      let instance2 = new Registry().inst();

      expect(instance1).toBe(instance2);
    });
  });

  describe("set", () => {
    test("should set a value", () => {
      let registry = new RegistrySpy();
      registry.set("key", "test-value");

      expect(_.get(RegistrySpy.instance, "key")).toBe("test-value");
    });
  });

  describe("set", () => {
    test("should get a value", () => {
      let registry = new RegistrySpy();
      RegistrySpy.registry = { "test-key": "123" };

      expect(_.get(RegistrySpy.instance, "key")).toBe("test-value");
    });
  });
});
