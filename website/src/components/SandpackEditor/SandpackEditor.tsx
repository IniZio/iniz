import { Sandpack } from "@codesandbox/sandpack-react";
import React from "react";
import { createFileMap } from "./createFileMap";

const SandpackEditor = ({
  children,
  template = "vanilla-ts",
  dependencies = {},
}: {
  children: JSX.Element;
  template: "react-ts" | "vanilla-ts";
  dependencies: { [key: string]: string };
}) => {
  const files = createFileMap({ template, children });

  return (
    <Sandpack
      template={template}
      files={files}
      theme="auto"
      options={{
        showNavigator: true,
        showLineNumbers: true,
      }}
      customSetup={{
        dependencies,
      }}
    />
  );
};

export default SandpackEditor;
