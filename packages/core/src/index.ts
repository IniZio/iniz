import { canProxy } from './util';

export const IS_ATOM = Symbol("IS_ATOM");
export const IS_PROXY = Symbol("IS_PROXY");
export const IS_OBSERVER = Symbol("IS_OBSERVER");

let currentObserver: Observer | undefined;

let batchLevel = 0;
const batchedObservers = new Set<Observer>();

interface Observer {
  [IS_OBSERVER]: Symbol;

  register(atom: Atom<any>): void;
  notify(): void;
}

export class Atom<TValue> {
  [IS_ATOM] = Symbol();

  #createValueHandler = (parentPath: (string | symbol)[] = []): ProxyHandler<any> => {
    const r = this;

    return {
      get(target, key) {
        if (key === IS_PROXY) {
          return true;
        }

        const path = parentPath.concat(key);

        if (canProxy(target[key]) && !target[key][IS_PROXY]) {
          return new Proxy(target[key], r.#createValueHandler(path));
        }

        if (currentObserver) {
          if (!r.#observerBySymbol.get(currentObserver[IS_OBSERVER])) {
            r.#observerBySymbol.set(currentObserver[IS_OBSERVER], {
              paths: [],
              observer: currentObserver,
            })
            currentObserver.register(r);
          }

          const observer = r.#observerBySymbol.get(currentObserver[IS_OBSERVER]);
          if (!observer?.paths.find(p => path.join('.').startsWith(p.join('.')))) {
            observer?.paths.push(path);
          }
        }

        return target[key];
      },
      set(target, prop, value) {
        const path = parentPath.concat(prop);

        batch(() => {
          target[prop] = value;
          r.#observerBySymbol.forEach(({ paths: ps, observer }) => {
            if(!ps.find(p => p.join('.').startsWith(path.join('.')))) {
              return;
            }

            batchedObservers.add(observer);
          });
        });

        return true;
      }
    }
  }

  proxy: any;

  #observerBySymbol = new Map<Symbol, { paths: (string | symbol)[][]; observer: Observer; }>();

  get value(): TValue {
    return this.proxy.value;
  }
  set value(val: TValue) {
    this.proxy.value = val;
  }

  constructor(value: TValue) {
    this.proxy = new Proxy(
      { value },
      this.#createValueHandler()
    );
  }

  unsubscribe(observer: Observer) {
    this.#observerBySymbol.delete(observer[IS_OBSERVER]);
  }
}

export class Effect implements Observer {
  [IS_OBSERVER] = Symbol();

  #atomBySymbol = new Map<Symbol, Atom<any>>()

  #callback: () => void;
  #onNotify?: () => void;
  #tilNextTick?: boolean;

  constructor(callback: () => void, { onNotify, tilNextTick }: { onNotify?: () => void, tilNextTick?: boolean } = {}) {
    this.#callback = callback;
    this.#onNotify = onNotify;
    this.#tilNextTick = tilNextTick;
  }

  exec() {
    currentObserver = this;

    this.#callback();

    if (this.#tilNextTick) {
      setTimeout(() => { currentObserver = undefined; });
    } else {
      currentObserver = undefined;
    }
  }

  dispose = () => {
    this.#atomBySymbol.forEach((reim) => {
      reim.unsubscribe(this);
    });
    this.#atomBySymbol.clear();
  }

  notify() {
    this.exec();
    this.#onNotify?.();
  }

  register(atom: Atom<any>): void {
    this.#atomBySymbol.set(atom[IS_ATOM], atom);
  }
}

export function effect(callback: () => void, onNotify?: () => void) {
  const effect = new Effect(callback, { onNotify });

  effect.exec();
  return effect.dispose;
}

type extractValue<T> = T extends Atom<infer V> ? V : T

function isAtom(value: any): value is Atom<extractValue<typeof value>> {
  return (value as any)?.[IS_ATOM];
}

export function atom<TValue>(value: TValue): Atom<extractValue<TValue>> {
  return (isAtom(value) ? value : new Atom(value)) as any;
}

function startBatch() { batchLevel++; }
function endBatch() {
  if (batchLevel > 1) {
    batchLevel--;
    return;
  }

  batchedObservers.forEach(o => o.notify());
  batchedObservers.clear();
  batchLevel--;
}

export function batch(callback: () => void) {
  startBatch();
  callback();
  endBatch();
}