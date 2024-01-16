module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  root: true,
  env: {
    node: true
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "object-curly-spacing": ["error", "never"],
    "array-bracket-spacing": ["error", "never"],
    "template-curly-spacing": ["error", "never"],
    "comma-dangle": ["error", "never"],
    "quotes": ["error", "double"],
    "jsx-quotes": ["error", "prefer-double"],
    "semi": "off",
    "@typescript-eslint/semi": ["error", "never"],
    "@typescript-eslint/member-delimiter-style": ["error", {
      "multiline": {
        "delimiter": "none",
        "requireLast": false
      },
      "singleline": {
        "delimiter": "comma",
        "requireLast": false
      }
    }],
    "import/no-anonymous-default-export": "off",
    "no-multiple-empty-lines": ["error", {
      "max": 1
    }]
  }
}
