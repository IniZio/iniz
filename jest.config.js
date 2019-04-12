module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  'modulePathIgnorePatterns': [
    'examples/.*',
    'packages/.*/dist'
  ],
  'collectCoverageFrom': [
    'packages/*/src/**/*.js'
  ],
  'coverageReporters': [
    'json',
    'lcov'
  ],
  'projects': [
    '<rootDir>'
    // '<rootDir>/examples/*/'
  ],
  'snapshotSerializers': [],
  'testPathIgnorePatterns': [
    '/node_modules/',
    '/examples/',
    '/e2e/.*/__tests__',
    '\\.snap$',
    '/packages/.*/dist'
  ]
};
