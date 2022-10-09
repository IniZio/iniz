import { batch, batchedObservers } from "./batch";
import { activeObserver, IS_OBSERVER, Observer } from "./observer";
import { UNSCOPED_ATOM } from "./scopedAtom";
import { extractValue } from "./types";
import { arrayStartsWith, canProxy } from "./util";

export const IS_ATOM = Symbol("IS_ATOM");
export const IS_PROXY = Symbol("IS_PROXY");
export const CURRENT_PATH = Symbol("CURRENT_PATH");

export class Atom<TValue> {
  [IS_ATOM] = Symbol();
  [CURRENT_PATH]: (string | symbol)[] = [];

  readonly = false;

  #createValueHandler = (
    parentPath: (string | symbol)[] = [],
    markedObserver?: { paths: (string | symbol)[][]; observer: Observer }
  ): ProxyHandler<any> => {
    const r = this;

    return {
      get(target, key) {
        if (key === IS_PROXY) {
          return true;
        }

        if (key === UNSCOPED_ATOM) {
          return r;
        }

        if (key === CURRENT_PATH) {
          return parentPath;
        }

        let scope = markedObserver ?? r.#markedObserverBySymbol.get(key as any);

        let currentPath: (string | symbol)[];
        let value: any;
        if (r.#markedObserverBySymbol.has(key as any)) {
          currentPath = parentPath;
          value = target;
        } else {
          currentPath = parentPath.concat(key);
          value = target[key];
        }

        if (canProxy(value) && !value[IS_PROXY] && !value[IS_ATOM]) {
          return new Proxy(value, r.#createValueHandler(currentPath, scope));
        }

        if (activeObserver.current) {
          if (!r.#observerBySymbol.get(activeObserver.current[IS_OBSERVER])) {
            r.#observerBySymbol.set(activeObserver.current[IS_OBSERVER], {
              paths: [],
              observer: activeObserver.current,
            });
            activeObserver.current.register(r);
          }

          const observer = r.#observerBySymbol.get(
            activeObserver.current[IS_OBSERVER]
          );
          if (
            !observer?.paths.find((observerPath) =>
              arrayStartsWith(currentPath, observerPath)
            )
          ) {
            observer?.paths.push(currentPath);
          }
        }

        if (
          scope &&
          !scope.paths.some((observerPath) =>
            arrayStartsWith(currentPath, observerPath)
          )
        ) {
          scope.paths.push(currentPath);
        }

        return value;
      },
      set(target, prop, value) {
        if (r.readonly) {
          throw new Error("Cannot assign to readonly atom");
        }

        const currentPath = parentPath.concat(prop);

        batch(() => {
          target[prop] = value;
          r.#observerBySymbol.forEach(({ paths: observerPaths, observer }) => {
            if (
              !observerPaths.find((observerPath) =>
                arrayStartsWith(observerPath, currentPath)
              )
            ) {
              return;
            }

            batchedObservers.add(observer);
          });

          r.#markedObserverBySymbol.forEach(
            ({ paths: observerPaths, observer }) => {
              if (
                !observerPaths.find((observerPath) =>
                  arrayStartsWith(observerPath, currentPath)
                )
              ) {
                return;
              }

              batchedObservers.add(observer);
            }
          );
        });

        return true;
      },
    };
  };

  _proxy: any;
  #observerBySymbol = new Map<
    Symbol,
    { paths: (string | symbol)[][]; observer: Observer }
  >();
  #markedObserverBySymbol = new Map<
    Symbol,
    { paths: (string | symbol)[][]; observer: Observer }
  >();

  get value(): TValue {
    return this._proxy.value;
  }
  set value(val: TValue) {
    this._proxy.value = val;
  }

  constructor(value: TValue) {
    this._proxy = new Proxy({ value }, this.#createValueHandler());
  }

  mark = (observer: Observer) => {
    this.#markedObserverBySymbol.set(observer[IS_OBSERVER], {
      paths: [],
      observer,
    });
  };

  unmark = (observer: Observer) => {
    this.#markedObserverBySymbol.delete(observer[IS_OBSERVER]);
  };

  unsubscribe(observer: Observer) {
    this.#observerBySymbol.delete(observer[IS_OBSERVER]);
  }
}

export function isAtom(value: any): value is Atom<extractValue<typeof value>> {
  return (value as any)?.[IS_ATOM];
}

export function atom<TValue>(value: TValue): Atom<extractValue<TValue>> {
  return (isAtom(value) ? value : new Atom(value)) as any;
}
