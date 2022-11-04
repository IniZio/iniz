// @ts-ignore
import { jsxDEV as ReactJsxDEV } from "react/jsx-dev-runtime";
import { proxyCreateElement } from "./createElement";

// @ts-ignore
export { Fragment } from "react/jsx-runtime";

export const jsxDEV = proxyCreateElement(ReactJsxDEV);
