module.exports = {
  moduleName: 'Reim',
  format: ['cjs', 'umd', 'es', 'iife'],
  global: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  external: ['react', 'react-dom'],
  commonjs: {
    namedExports: {
      'node_modules/react-is/index.js': ['isValidElementType'],
      'node_modules/lodash/lodash.js': ['merge']
    }
  }
}
