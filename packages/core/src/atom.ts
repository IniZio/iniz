import { batch, batchedObservers } from "./batch";
import { activeObserver, IS_OBSERVER, Observer } from "./observer";
import { extractValue } from "./types";
import { arrayStartsWith, canProxy } from "./util";

export const IS_ATOM = Symbol("IS_ATOM");
export const IS_PROXY = Symbol("IS_PROXY");

export class Atom<TValue> {
  [IS_ATOM] = Symbol();

  #createValueHandler = (
    parentPath: (string | symbol)[] = []
  ): ProxyHandler<any> => {
    const r = this;

    return {
      get(target, key) {
        if (key === IS_PROXY) {
          return true;
        }

        const currentPath = parentPath.concat(key);

        if (canProxy(target[key]) && !target[key][IS_PROXY]) {
          return new Proxy(target[key], r.#createValueHandler(currentPath));
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

        return target[key];
      },
      set(target, prop, value) {
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
        });

        return true;
      },
    };
  };

  #proxy: any;
  #observerBySymbol = new Map<
    Symbol,
    { paths: (string | symbol)[][]; observer: Observer }
  >();

  get value(): TValue {
    return this.#proxy.value;
  }
  set value(val: TValue) {
    this.#proxy.value = val;
  }

  constructor(value: TValue) {
    this.#proxy = new Proxy({ value }, this.#createValueHandler());
  }

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
