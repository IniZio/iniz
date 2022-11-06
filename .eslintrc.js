module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `@iniz/eslint-config-internal`
  extends: ["@iniz/eslint-config-internal"],
  settings: {
    next: {
      rootDir: ["examples/*/"],
    },
  },
};
