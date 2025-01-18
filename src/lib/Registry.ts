import IRegistry from "./IRegistry";
import ISingletonStatic from "./ISingleton";
import _ from "lodash";

export default class Registry implements IRegistry, ISingletonStatic<Registry> {
  protected static instance: Registry;

  protected registry: any = {};

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
    let inst = this.inst().registry;
    return _.get(inst, k);
  }

  set<V>(k: string, v: V): void {
    let inst = this.inst().registry;
    inst = _.set(inst, k, v);
    Registry.instance = inst;
  }
}
