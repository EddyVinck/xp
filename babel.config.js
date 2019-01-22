const isProd = String(process.env.NODE_ENV) === "production";
const isTest = String(process.env.NODE_ENV) === "test";

/*

              options: {
                presets: ["@babel/env"],
                plugins: ["@babel/syntax-dynamic-import"]
              }
*/

module.exports = {
  presets: [
    ["@babel/preset-env", { modules: isTest ? "commonjs" : false }],
    "@babel/preset-typescript"
  ],
  plugins: [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread"
  ].filter(Boolean)
};

// {
//   "presets": ["@babel/preset-env", "@babel/preset-typescript"],
//   "plugins": [
//     "@babel/plugin-syntax-dynamic-import",
//     "@babel/plugin-proposal-class-properties",
//     "@babel/plugin-proposal-object-rest-spread"
//   ]
// }
