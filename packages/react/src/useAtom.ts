import { useReducer, useRef, useState, useEffect } from "react";
import { Effect, atom } from "@reim/core";

export const RAW_ATOM = Symbol("RAW_ATOM");

export function useAtom<TValue>(atomOrInitialValue: TValue) {
  const [, forceUpdate] = useReducer((f) => f + 1, 0);

  const listener = useRef<Effect>();
  const [snapshot] = useState(() => {
    /*
    Here we ensure the new proxy is always applied on unproxied atom.

    This allows a child component to wrap a useAtom from parent with useAtom again,
    thus preventing parent from re-rendering when child component is updating a property that the parent is not using
    */
    const maybeProxiedAtom = atom(atomOrInitialValue);
    let rawAtom: typeof maybeProxiedAtom =
      (maybeProxiedAtom as any)?.[RAW_ATOM] ?? maybeProxiedAtom;

    let value: any;

    return new Proxy(rawAtom, {
      get: (target, prop) => {
        if (prop === RAW_ATOM) {
          return rawAtom;
        }

        if (!listener.current) {
          listener.current = new Effect(
            () => {
              value = (target as any)[prop];
            },
            { onNotify: forceUpdate, tilNextTick: true }
          );
        }
        listener.current?.exec();

        return value;
      },
      set: (target, prop, value) => {
        (target as any)[prop] = value;
        return true;
      },
    });
  });

  // HACK: useEffect is triggered twice under strict mode
  // Currently our effect's final status become disposed after mount strict mode is active,
  // so we force update after dispose to ensure effect collects again if the component is not actually unmounted
  useEffect(
    () => () => {
      listener.current?.dispose();
      forceUpdate();
    },
    []
  );

  return snapshot;
}
