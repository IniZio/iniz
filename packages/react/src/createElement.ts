/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

import { activeObserver, Effect } from "@iniz/core";
import React, { FunctionComponent, useState } from "react";
import _jsxRuntimeDev from "react/jsx-dev-runtime";
import _jsxRuntime from "react/jsx-runtime";

// Makes this work < React v17
import { useSyncExternalStore } from "use-sync-external-store/shim";

// NOTE: Using proxy here to change function call but keep all properties
const proxyHandler: ProxyHandler<FunctionComponent> = {
  apply(target, thisArg, argArray: [any, any]) {
    const [effectAsStore] = useState(() => {
      const effectAsSession = new Effect(() => {});
      let currentOnStoreChange: (() => void) | null = null;
      let snapshot = 0;

      effectAsSession.onNotify = function () {
        snapshot++;
        currentOnStoreChange?.();
      };

      return {
        effectAsSession,
        subscribe: (onStoreChange: () => void) => {
          currentOnStoreChange = onStoreChange;

          return () => {
            snapshot++;
            currentOnStoreChange = null;
            effectAsSession.dispose();
          };
        },
        getSnapshot: () => {
          return snapshot;
        },
      };
    });

    useSyncExternalStore(
      effectAsStore.subscribe,
      effectAsStore.getSnapshot,
      effectAsStore.getSnapshot
    );

    // HACK: Cannot even put it inside a callback of the effect not sure why yet...
    activeObserver.current = effectAsStore.effectAsSession;
    const children = target.apply(thisArg, argArray);
    activeObserver.current = undefined;

    return children;
  },
};

const proxiedComponentMap = new Map<FunctionComponent, FunctionComponent>();
function getOrCreateProxiedComponent(Component: FunctionComponent) {
  if (!proxiedComponentMap.has(Component)) {
    const ProxiedComponent = new Proxy(Component, proxyHandler);

    proxiedComponentMap.set(Component, ProxiedComponent);
    proxiedComponentMap.set(ProxiedComponent, ProxiedComponent);
  }

  return proxiedComponentMap.get(Component);
}

function proxyCreateElement(createElement: any) {
  if (typeof createElement !== "function") return createElement;

  return (type: any, props: any, ...children: any[]) => {
    let proxiedType = type;

    if (typeof type === "function") {
      proxiedType = getOrCreateProxiedComponent(type);
    } else if (
      type &&
      typeof type === "object" &&
      typeof type.type === "function"
    ) {
      proxiedType.type = getOrCreateProxiedComponent(type);
    }

    return createElement(proxiedType, props, ...children);
  };
}

if (React) {
  React.createElement = proxyCreateElement(React.createElement);
}

// Wasted hours to find that I forgot React v17 has new jsx runtime thing...
// Saved me: https://stackoverflow.com/a/70755183
const jsxRuntime: any = _jsxRuntime;
if (jsxRuntime) {
  jsxRuntime.jsx = proxyCreateElement(jsxRuntime.jsx);
}
const jsxRuntimeDev: any = _jsxRuntimeDev;
if (jsxRuntimeDev) {
  jsxRuntimeDev.jsxDEV = proxyCreateElement(jsxRuntimeDev.jsxDEV);
}
