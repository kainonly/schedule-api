import * as path from 'path';
import * as webpack from 'webpack';
import * as nodeExternals from 'webpack-node-externals';

const config: webpack.Configuration = {
  entry: './src/main.ts',
  target: 'node',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  externals: [
    nodeExternals(),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'schedule-api.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

export default config;
