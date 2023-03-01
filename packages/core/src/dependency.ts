import { notifyStack } from "./batch";
import { Observer, observerStack } from "./observer";
import { Store } from "./store";
import { arrayStartsWith } from "./util";

interface Dependency {
  store: Store<any>;
  paths: (string | symbol | number)[][];
}

interface Access {
  store: Store<any>;
  path: (string | symbol | number)[];
}

export const OBJECT_LENGTH_KEY = Symbol.for("OBJECT_LENGTH_KEY");

const observerMap = new Map<Observer, Dependency[]>();
const storeMap = new Map<Store<any>, Set<Observer>>();

export class DependencyTracker {
  static addDependency(access: Access) {
    const observer = observerStack.slice(-1)[0];
    if (!observer) return;

    if (!observerMap.has(observer)) {
      observerMap.set(observer, []);
    }
    const dependencies = observerMap.get(observer)!;

    const dependency = dependencies.find((dep) => dep.store === access.store);
    if (!dependency) {
      dependencies.push({
        store: access.store,
        paths: [access.path],
      });
    } else if (
      !dependency.paths.some((path) => arrayStartsWith(access.path, path))
    ) {
      dependency.paths.push(access.path);
    }

    if (!storeMap.has(access.store)) {
      storeMap.set(access.store, new Set());
    }
    storeMap.get(access.store)!.add(observer);
  }

  static clearDependencies(observer: Observer) {
    const dependencies = observerMap.get(observer);
    if (!dependencies) return;

    for (const dependency of dependencies) {
      const observerSet = storeMap.get(dependency.store);
      if (!observerSet) continue;

      observerSet.delete(observer);
      if (observerSet.size === 0) {
        storeMap.delete(dependency.store);
      }
    }

    observerMap.delete(observer);
  }

  static notifyObservers(access: Access) {
    const observerSet = storeMap.get(access.store);
    if (!observerSet) {
      return;
    }

    // Copy observerSet to avoid infinite growing observerSet
    // TODO: Should error if the list keep growing?
    for (const observer of [...observerSet]) {
      if (observer === observerStack.slice(-1)[0]) continue;

      const dependencies = observerMap.get(observer);
      if (!dependencies) continue;

      const dependency = dependencies.find((dep) => dep.store === access.store);
      if (!dependency) continue;

      if (
        !dependency.paths.some((path) => arrayStartsWith(path, access.path))
      ) {
        continue;
      }

      if (!notifyStack.includes(observer)) {
        notifyStack.push(observer);
      }
    }
  }
}
