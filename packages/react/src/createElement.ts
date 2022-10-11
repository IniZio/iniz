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
    const effectAsSession = new Effect(() => {});

    const [effectAsStore] = useState(() => {
      let snapshot = 0;
      let currentOnStoreChange: (() => void) | undefined;

      effectAsSession.onNotify = function () {
        console.log("=== notified", currentOnStoreChange);
        snapshot++;
        currentOnStoreChange?.();
      };

      return {
        subscribe: (onStoreChange: () => void) => {
          currentOnStoreChange = onStoreChange;

          return () => {
            // FIXME: I know that strict mode wil execute effects twice, but can't find workaround under strict mode...
            currentOnStoreChange = undefined;
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
    activeObserver.current = effectAsSession;
    const children = target.apply(thisArg, argArray);
    activeObserver.current = undefined;

    return children;
  },
};

// TODO: Also process `useAtom`?
function proxyCreateElement(createElement: any) {
  if (typeof createElement !== "function") return createElement;

  return (type: any, props: any, ...children: any[]) => {
    let proxiedType = type;

    if (typeof type === "function") {
      proxiedType = new Proxy(type, proxyHandler);
    } else if (
      type &&
      typeof type === "object" &&
      typeof type.type === "function"
    ) {
      proxiedType.type = new Proxy(type, proxyHandler);
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
