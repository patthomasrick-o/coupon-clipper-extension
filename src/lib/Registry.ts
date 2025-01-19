import _ from "lodash";
import IRegistry from "./IRegistry.js";
import ISingleton from "./ISingleton.js";

export default class Registry implements IRegistry, ISingleton<Registry> {
  protected static instance: Registry;

  protected registry: object = {};

  constructor() {
    this.registry = {};
  }

  //
  // ISingleton
  //
  inst(): Registry {
    if (!Registry.instance) {
      Registry.instance = new Registry();
    }

    return Registry.instance;
  }

  //
  // IRegistry
  //

  get<V>(k: string): V {
    const inst = (this.inst() as Registry).registry;
    return _.get(inst, k);
  }

  set<V>(k: string, v: V): void {
    let inst = (this.inst() as Registry).registry;
    inst = _.set(inst, k, v);
    (this.inst() as Registry).registry = inst;
  }
}
