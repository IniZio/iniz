import type { SandpackFile } from "@codesandbox/sandpack-react";
import React from "react";

export const createFileMap = ({
  template,
  children,
}: {
  template: "react-ts" | "vanilla-ts";
  children: JSX.Element;
}): Record<string, SandpackFile> => {
  let codeSnippets = React.Children.toArray(children) as React.ReactElement[];

  return codeSnippets.reduce(
    (result: Record<string, SandpackFile>, codeSnippet: React.ReactElement) => {
      if (codeSnippet.props.mdxType !== "pre") {
        return result;
      }
      const { props } = codeSnippet.props.children;
      let filePath; // path in the folder structure
      let fileHidden = false; // if the file is available as a tab
      let fileActive = false; // if the file tab is shown by default

      if (props.metastring) {
        const [name, ...params] = props.metastring.split(" ");
        filePath = "/" + name;
        if (params.includes("hidden")) {
          fileHidden = true;
        }
        if (params.includes("active")) {
          fileActive = true;
        }
      } else {
        if (props.className === "language-js") {
          filePath = "src/index.js";
        } else if (props.className === "language-ts") {
          filePath = "src/index.ts";
        } else if (props.className === "language-tsx") {
          filePath = "/App.tsx";
        } else if (props.className === "language-css") {
          filePath = "/styles.css";
        } else {
          throw new Error(
            `Code block is missing a filename: ${props.children}`
          );
        }
      }
      if (result[filePath]) {
        throw new Error(
          `File ${filePath} was defined multiple times. Each file snippet should have a unique path name`
        );
      }
      result[filePath] = {
        code: props.children as string,
        hidden: fileHidden,
        active: fileActive,
      };

      if (template === "react-ts") {
        result["/index.tsx"] = {
          code: `
          /** @jsxRuntime classic */

          import React from 'react';
          import { render } from 'react-dom';

          import App from './App';

          const rootElement = document.getElementById('root');
          render(<App />, rootElement);
          `,
          hidden: true,
          active: false,
        };
      }

      return result;
    },
    {}
  );
};
