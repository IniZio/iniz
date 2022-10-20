import { Atom, isAtom } from "./atom";
import { endBatch, startBatch } from "./batch";
import { DependencyTracker } from "./dependency";
import { isRef } from "./ref";
import { extractStateValue } from "./types";
import { isClass } from "./util";

export const IS_STATE = Symbol.for("IS_STATE");

export type State<TValue> = (TValue extends
  | { [k in keyof TValue]: State<any> }
  | { [k in keyof TValue]: Atom<any> }
  ? {
      [k in keyof TValue]: extractStateValue<TValue[k]>;
    }
  : TValue) & {
  /** @internal */
  [IS_STATE]?: true;
};

export function isState<TValue>(value: TValue): value is State<any> {
  return !!(value as any)?.[IS_STATE];
}

export function canApplyStateProxy(value: any): boolean {
  return (
    value !== undefined &&
    value !== null &&
    typeof value === "object" &&
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

export function state<TValue>(value: TValue): State<extractStateValue<TValue>> {
  if (isState(value)) {
    return value as any;
  }

  // HACK: Allow function to make atom work
  if (!canApplyStateProxy(value) && typeof value !== "function") {
    throw new Error("Provided value is not compatitable with Proxy");
  }

  let state: any;

  function createProxyHandler(
    root: TValue | undefined = undefined,
    parentPropArray: (string | symbol)[] = [],
    untrack: boolean = false
  ): ProxyHandler<any> {
    return {
      apply(target, _thisArg, argArray) {
        return target.apply(state, argArray);
      },
      get(target, prop, receiver) {
        if (prop === IS_STATE) {
          return !root;
        }

        const currentPropArray = parentPropArray.concat(prop);
        let value = Reflect.get(target, prop, receiver);

        let untrackChild = untrack;

        if (isRef(value)) {
          value = value.value;
          untrackChild = true;
        }

        if (isAtom(value)) {
          value = value();
        }

        if (canApplyStateProxy(value)) {
          return new Proxy(
            value,
            createProxyHandler(root ?? target, currentPropArray, untrackChild)
          );
        }

        DependencyTracker.addDependency({
          state: root ?? target,
          path: currentPropArray,
        });

        return value;
      },
      set(target, prop, newValue, receiver) {
        // TODO: Allow customized equality check?
        if (Reflect.get(target, prop, receiver) === newValue) {
          return true;
        }

        const currentPropArray = parentPropArray.concat(prop);

        startBatch();
        Reflect.set(target, prop, newValue, receiver);
        if (!untrack) {
          DependencyTracker.notifyObservers({
            state: root ?? target,
            path: currentPropArray,
          });
        }
        endBatch();

        return true;
      },
    };
  }

  state = new Proxy(value, createProxyHandler());
  return state;
}
