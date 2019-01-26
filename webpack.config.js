const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const createPages = require("./webpack.functions");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const createPages = mode => [
  new HtmlWebpackPlugin({
    filename: "index.html",
    template: "src/index.html",
    hash: true,
    minify: false
  })
];

module.exports = (env, argv) => {
  console.log(`mode: ${argv.mode}`);

  const myWebpackConfig = {
    entry: {
      index: "./src/js/index.ts"
    },

    output: {
      filename: "[name].entry.js",
      path: path.resolve(__dirname, "dist")
    },

    module: {
      rules: [
        {
          test: /\.ts|js$/,
          exclude: /node_modules/,
          include: path.resolve(__dirname, "src"),
          use: [
            {
              loader: "babel-loader"
            },
            {
              loader: "eslint-loader"
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|gif|ico|webmanifest)$/,
          include: [path.resolve(__dirname, "src/img")],
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "img/"
              }
            },
            {
              loader: "image-webpack-loader",
              options: {
                disable: true, // webpack@2.x and newer
                mozjpeg: {
                  progressive: true,
                  quality: 65
                },
                // optipng.enabled: false will disable optipng
                optipng: {
                  enabled: true
                },
                pngquant: {
                  quality: "65-90",
                  speed: 4
                },
                gifsicle: {
                  interlaced: false
                },
                // the webp option will enable WEBP
                webp: {
                  quality: 75
                }
              }
            }
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
          include: [path.resolve(__dirname, "src/assets/fonts")],
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "assets/fonts/"
              }
            }
          ]
        },
        {
          test: /\.(scss|css)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: { publicPath: "../" }
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: true
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        }
      ]
    },

    devServer: {
      contentBase: "./dist",
      compress: true,
      port: "9000"
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/
    },
    resolve: {
      extensions: [".ts", ".js", ".json"],
      alias: {
        fontello: path.resolve(__dirname, "src/assets/fonts/icons/fontello-icons"),
        img: path.resolve(__dirname, "src/img")
      }
    },
    devtool: "source-map",
    plugins: [
      new MiniCssExtractPlugin({
        filename: "styles/[name].css",
        chunkFilename: "styles/[id].css"
      })
    ].concat(createPages())
  };

  console.log();

  return myWebpackConfig;
};
