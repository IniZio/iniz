// @ts-ignore
import { jsx as ReactJsx, jsxs as ReactJsxs } from "react/jsx-runtime";
import { proxyCreateElement } from "./createElement";

// @ts-ignore
export { Fragment } from "react/jsx-runtime";

export const jsx = proxyCreateElement(ReactJsx);
export const jsxs = proxyCreateElement(ReactJsxs);
