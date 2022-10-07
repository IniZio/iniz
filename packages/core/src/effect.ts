import { Observer } from "./observer";

export class Effect extends Observer {}

export function effect(callback: () => void, onNotify?: () => void) {
  const effect = new Effect(callback, { onNotify });

  effect.exec();
  return effect.dispose;
}
