import path from 'path'
import toPascal from 'to-pascal-case'
import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import getLernaPackages from 'get-lerna-packages'

const builds = {
  'reim': {
    external: [
      // 'immer', 'event-emitter'
    ]
  },
  'react-reim': {
    globals: {
      'react': 'React',
      'react-dom': 'ReactDOM'
    },
    external: [
      'react', 'react-dom', 'prop-types'
    ]
  },
  'reim-persist': {},
  'reim-task': {
    globals: {
      'reim': 'Reim'
    },
    external: [
      'reim'
    ]
  },
  'reim-reporter': {}
}

const ALL_MODULES = getLernaPackages(process.cwd()).map(
  name => name.replace(/(.*)packages\//, '')
)

const mirror = array =>
  array.reduce((acc, val) => ({...acc, [val]: val}), {})

const isBrowserBundle = format => ['umd', 'iife'].includes(format)

export default Object.keys(builds).reduce((tasks, name) => {
  const build = builds[name]

  const PACKAGE_ROOT_PATH = path.join(process.cwd(), 'packages', name)
  const INPUT_FILE = path.join(PACKAGE_ROOT_PATH, 'src/index.js')
  const OUTPUT_DIR = path.join(PACKAGE_ROOT_PATH, 'dist')
  // const PKG_JSON = require(path.join(PACKAGE_ROOT_PATH, 'package.json'))

  return [
    ...tasks,
    ...['es', 'umd', 'cjs', 'iife'].map(format => ({
      plugins: [
        babel(),
        commonjs({
          include: 'node_modules/**',
          namedExports: {
            'node_modules/react/index.js': ['createContext', 'PureComponent', 'Component'],
            'node_modules/event-emitter/index.js': ['default', 'emitterize']
          }
        }),
        isBrowserBundle(format) &&
          nodeResolve({
            main: false,
            module: true,
            jsnext: true,
            extensions: ['.js', '.json'],
            preferBuiltIns: true,
            browser: isBrowserBundle(format)
          })
      ].filter(Boolean),
      input: INPUT_FILE,
      external: isBrowserBundle(format) ? build.external : [...ALL_MODULES, ...(build.external || [])],
      output: {
        name: toPascal(name),
        file: path.join(OUTPUT_DIR, `${name}.${format}.js`),
        format,
        globals: isBrowserBundle(format) ? {...mirror(ALL_MODULES), ...build.globals} : build.globals,
        sourcemap: true
      }
    }))
  ]
}, [])
