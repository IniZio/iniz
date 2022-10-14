import { endBatchV2, startBatchV2 } from "./batch";
import { DependencyTracker } from "./dependency";
import { extractStateV2Value } from "./types";
import { isClass } from "./util";

export const IS_ATOM = Symbol("ATOM_CONTROL");

export type StateV2<TValue> = TValue & {
  /** @internal */
  [IS_ATOM]: true;
};

export function isStateV2<TValue>(
  value: TValue
): value is StateV2<extractStateV2Value<typeof value>> {
  return !!(value as any)?.[IS_ATOM];
}

export function canApplyStateV2Proxy(value: any): boolean {
  return (
    value !== undefined &&
    (typeof value === "object" ||
      // HACK: For primitive to work, is this a good idea though...?
      typeof value === "function") &&
    (!isClass(value) ||
      (!(value instanceof Map) &&
        !(value instanceof Set) &&
        !(value instanceof WeakMap) &&
        !(value instanceof WeakSet) &&
        !(value instanceof Error) &&
        !(value instanceof Number) &&
        !(value instanceof Date) &&
        !(value instanceof String) &&
        !(value instanceof RegExp) &&
        !(value instanceof ArrayBuffer)))
  );
}

export function stateV2<TValue extends object>(
  value: TValue
): StateV2<extractStateV2Value<TValue>> {
  if (isStateV2(value)) {
    return value as any;
  }

  if (!canApplyStateV2Proxy(value)) {
    throw new Error("Provided value is not compatitable with Proxy");
  }

  function createProxyHandler(
    root: TValue | undefined = undefined,
    parentPropArray: (string | symbol)[] = []
  ): ProxyHandler<any> {
    return {
      apply(target, thisArg, argArray) {
        // Primitive
        if (!root && typeof target === "function") {
          const VALUE_KEY = "value";
          if (argArray.length === 0) {
            return target[VALUE_KEY];
          }

          target[VALUE_KEY] = argArray[0];
        }

        return target.apply(thisArg, argArray);
      },
      get(target, prop, receiver) {
        if (prop === IS_ATOM) {
          return true;
        }

        const currentPropArray = parentPropArray.concat(prop);
        const value = Reflect.get(target, prop, receiver);

        if (canApplyStateV2Proxy(value)) {
          return new Proxy(
            value,
            createProxyHandler(root ?? target, currentPropArray)
          );
        }

        DependencyTracker.addDependency({
          state: root ?? target,
          path: currentPropArray,
        });

        return value;
      },
      set(target, prop, newValue, receiver) {
        const currentPropArray = parentPropArray.concat(prop);

        startBatchV2();
        Reflect.set(target, prop, newValue, receiver);
        DependencyTracker.notifyObservers({
          state: root ?? target,
          path: currentPropArray,
        });
        endBatchV2();

        return true;
      },
    };
  }

  return new Proxy(value, createProxyHandler());
}
