const preset = {
  "presets": [
    "react"
  ],
  "plugins": [
    ["transform-object-rest-spread",
      {
        "useBuiltIns": true
      }
    ],
    "transform-flow-strip-types",
    "transform-class-properties"
  ]
}

if (process.env.NODE_ENV === 'test') {
  preset.presets.push(
    ["env", {
      "exclude": ["transform-regenerator", "transform-async-to-generator"]
    }],
  )
} else {
  preset.presets.push(
    "es2015-rollup",
    ["env", {
      "useBuiltIns": false,
      "modules": false,
      "exclude": ["transform-regenerator", "transform-async-to-generator"]
    }]
  )
}

module.exports = preset
