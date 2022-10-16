import {
  jsx as PreactJsx,
  jsxDEV as PreactJsxDEV,
  jsxs as PreactJsxs,
} from "preact/jsx-runtime";
import { proxyCreateElement } from "./createElement";

export { Fragment } from "preact";

export const jsx = proxyCreateElement(PreactJsx);
export const jsxs = proxyCreateElement(PreactJsxs);
export const jsxDEV = proxyCreateElement(PreactJsxDEV);
