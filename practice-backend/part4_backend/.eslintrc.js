// TODO: part 3d - configure ESLint for the backend
// use new ESLint/js module syntax to export the configuration object
// which uses
// "@eslint/js": "^9.22.0",
// "eslint": "^9.22.0"
module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
        jest: true
    },
    extends: 'eslint:recommended',
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['error', 'windows'],
        quotes: ['warn', 'single'],
        semi: ['error', 'always'],
        eqeqeq: 'error',
        'no-trailing-spaces': 'warn',
        'object-curly-spacing': ['error', 'always'],
        'arrow-spacing': ['error', { before: true, after: true }],
        'no-console': 0
    }
};
