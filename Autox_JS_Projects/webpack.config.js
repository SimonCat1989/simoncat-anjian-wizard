const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    android_utils: ['./src/app/Android_utils/main.ts'],
    android_i茅台: ['./src/app/Android_i茅台/main.ts'],
    android_喜马拉雅: ['./src/app/Android_喜马拉雅/main.ts'],
    android_bilibili: ['./src/app/Andoird_bilibili/main.ts'],
    android_京东: ['./src/app/Android_京东/main.ts'],
    android_卡通农场: ['./src/app/Android_卡通农场/main.ts'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: false
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: "webpack-autojs-loader",
          }
        ]
      },
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, 'src'),
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  target: "node",
  optimization: {
    minimize: false
  }
};