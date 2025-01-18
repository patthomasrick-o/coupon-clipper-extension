import Registry from "./Registry";

/** Spy of the Registry class that exposes the instance. */
export default class RegistrySpy extends Registry {
  public static instance: Registry;

  public static registry: any;
}
