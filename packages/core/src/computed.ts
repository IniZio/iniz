import { Atom } from "./atom";
import { Observer } from "./observer";

export class Computed<TValue> extends Atom<TValue> {
  #observer: Observer;
  #compute: () => TValue;

  constructor(
    compute: () => TValue,
    { onNotify }: { onNotify?: () => void } = {}
  ) {
    super(compute());

    this.readonly = true;

    this.#compute = compute;
    this.#observer = new Observer(this.#computeValue, {
      onNotify,
    });

    this.#observer.exec();
  }

  #computeValue = () => {
    this.readonly = false;
    this.value = this.#compute();
    this.readonly = true;
  };

  _updateCompute = (compute: () => TValue) => {};

  refresh = (compute?: () => TValue) => {
    this.#compute = compute ?? this.#compute;
    this.#observer.exec();
  };

  dispose = () => this.#observer.dispose();
}

export function computed<TValue>(
  callback: () => TValue,
  { onNotify }: { onNotify?: () => void } = {}
) {
  return new Computed(callback, { onNotify });
}