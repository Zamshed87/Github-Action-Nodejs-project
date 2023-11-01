module.exports = {
  entry: "./index.js",
  output: {
    filename: "bundle.js",
  },
  mode: "production",
  node: false,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"], // ensure compatibility with older browsers
            plugins: ["@babel/plugin-transform-object-assign"], // ensure compatibility with IE 11
          },
        },
      },
      {
        test: /\.js$/,
        loader: "webpack-remove-debug", // remove "debug" package
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel",
        query: {
          presets: ["react", "es2015"],
        },
      },
    ],
  },
};
