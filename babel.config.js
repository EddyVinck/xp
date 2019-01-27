const isProd = String(process.env.NODE_ENV) === 'production';
const isTest = String(process.env.NODE_ENV) === 'test';

module.exports = {
  presets: [
    ['@babel/preset-env', { modules: isTest ? 'commonjs' : false }],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    isTest ? 'babel-plugin-dynamic-import-node' : null, // transpile dynamic imports in tests
  ].filter(Boolean),
};
