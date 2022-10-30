import { notifyStack } from "./batch";
import { Observer, observerStack } from "./observer";
import { State } from "./state";
import { arrayStartsWith } from "./util";

interface Dependency {
  state: State<any>;
  paths: (string | symbol | number)[][];
}

interface Access {
  state: State<any>;
  path: (string | symbol | number)[];
}

export const OBJECT_LENGTH_KEY = Symbol.for("OBJECT_LENGTH_KEY");

const observerMap = new Map<Observer, Dependency[]>();
const stateMap = new Map<State<any>, Set<Observer>>();

export class DependencyTracker {
  static addDependency(access: Access) {
    const observer = observerStack.slice(-1)[0];
    if (!observer) return;

    if (!observerMap.has(observer)) {
      observerMap.set(observer, []);
    }
    const dependencies = observerMap.get(observer)!;

    const dependency = dependencies.find((dep) => dep.state === access.state);
    if (!dependency) {
      dependencies.push({
        state: access.state,
        paths: [access.path],
      });
    } else if (
      !dependency.paths.some((path) => arrayStartsWith(access.path, path))
    ) {
      dependency.paths.push(access.path);
    }

    if (!stateMap.has(access.state)) {
      stateMap.set(access.state, new Set());
    }
    stateMap.get(access.state)!.add(observer);
  }

  static clearDependencies(observer: Observer) {
    const dependencies = observerMap.get(observer);
    if (!dependencies) return;

    for (const dependency of dependencies) {
      const observerSet = stateMap.get(dependency.state);
      if (!observerSet) continue;

      observerSet.delete(observer);
      if (observerSet.size === 0) {
        stateMap.delete(dependency.state);
      }
    }

    observerMap.delete(observer);
  }

  static notifyObservers(access: Access) {
    const observerSet = stateMap.get(access.state);
    if (!observerSet) {
      return;
    }

    // Copy observerSet to avoid infinite growing observerSet
    // TODO: Should error if the list keep growing?
    for (const observer of [...observerSet]) {
      if (observer === observerStack.slice(-1)[0]) continue;

      const dependencies = observerMap.get(observer);
      if (!dependencies) continue;

      const dependency = dependencies.find((dep) => dep.state === access.state);
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
