/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

import { observer } from "@iniz/core";
import React, { FunctionComponent, useState } from "react";

// Makes this work < React v17
import { useSyncExternalStore } from "use-sync-external-store/shim";

// NOTE: Using proxy here to change function call but keep all properties
const proxyHandler: ProxyHandler<FunctionComponent> = {
  apply(target, thisArg, argArray: [any, any]) {
    const [observerAsSession] = useState(() => observer());
    const [observerAsStore] = useState(() => {
      let currentOnStoreChange: (() => void) | null = null;
      let snapshot = 0;

      observerAsSession.scheduler = function () {
        snapshot++;
        currentOnStoreChange?.();
      };

      return {
        subscribe: (onStoreChange: () => void) => {
          currentOnStoreChange = onStoreChange;

          return () => {
            snapshot++;
            currentOnStoreChange = null;
            observerAsSession.dispose();
          };
        },
        getSnapshot: () => {
          return snapshot;
        },
      };
    });

    useSyncExternalStore(
      observerAsStore.subscribe,
      observerAsStore.getSnapshot,
      observerAsStore.getSnapshot
    );

    observerAsSession.start();
    const children = target.apply(thisArg, argArray);
    observerAsSession.stop();

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

export function proxyCreateElement(createElement: any) {
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

// NOTE: This breaks bundlers that do not handle export default from the runtime files...
// Wasted hours to find that I forgot React v17 has new jsx runtime thing...
// Saved me: https://stackoverflow.com/a/70755183
// const jsxRuntime: any = _jsxRuntime;
// if (jsxRuntime) {
//   jsxRuntime.jsx = proxyCreateElement(jsxRuntime.jsx);
// }
// const jsxRuntimeDev: any = _jsxRuntimeDev;
// if (jsxRuntimeDev) {
//   jsxRuntimeDev.jsxDEV = proxyCreateElement(jsxRuntimeDev.jsxDEV);
// }
