import path from 'path';
import { fileURLToPath } from 'url';
import CopyWebpackPlugin from "copy-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: "./bootstrap.js",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "bootstrap.js"
    },
    mode: "development",
    experiments: {
        asyncWebAssembly: true
    },
    module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {from: "./index.html", to: "./"}
            ]
        })
    ]
}