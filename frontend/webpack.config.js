module.exports = {
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
            test: /\.scss$/,
            loaders: ["style-loader", "css-loader", "sass-loader"],
            include: path.resolve(__dirname, "../")
        }
      ]
    }
}