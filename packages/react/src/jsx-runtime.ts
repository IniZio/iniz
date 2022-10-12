// @ts-ignore
import { jsx as ReactJsx, jsxs as ReactJsxs } from "react/jsx-runtime";
import { proxyCreateElement } from "./createElement";

export const jsx = proxyCreateElement(ReactJsx);
export const jsxs = proxyCreateElement(ReactJsxs);
