const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require('webpack')

const config = {
    // entry: './src/index.js',
    // 多入口js
    entry: {
        'main': './src/index.js',
        'login': './src/login/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        // filename: 'main.js',
        // 多入口的js输出文件名也要处理
        filename: (pathData) => {
            console.log(pathData);
            return pathData.chunk.name === 'main' ? 'main.js' : './[name]/main.js';
        },
        clean: true,  // 打包之前清除之前的打包内容
    },
    plugins: [
        // 主页面
        new HtmlWebpackPlugin({
            // 指定要打包的html模版，也就是你的index.html
            template: path.resolve(__dirname, 'public/index.html'),
            // 指定打包后输出的html文件
            filename: path.resolve(__dirname, 'dist/index.html'),
            useCDN: process.env.NODE_ENV === 'production',
            chunks: ['main'],  // 指定该页面会引入哪些打包后的js模块，与entry的key相同
        }),
        // login页面
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/login.html'),
            filename: path.resolve(__dirname, 'dist/login/index.html'),
            useCDN: process.env.NODE_ENV === 'production',
            chunks: ['login'],
        }),
        new MiniCssExtractPlugin({
            // 多入口的css输出文件名也要处理
            filename: (pathData) => {
                return pathData.chunk.name === 'main' ? 'main.css' : './[name]/main.css';
            },
        }),
        new webpack.DefinePlugin({
            // key是注入到打包后的前端JS代码中作为全局变量
            // value是变量对应的值（corss-env注入在node.js中的环境变量字符串）
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                // use: ["style-loader", "css-loader"],
                use: [
                    process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                    "css-loader"
                ],
            },
            {
                test: /\.less$/i,
                use: [
                    // compiles Less to CSS
                    process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    'less-loader',
                ],
            },
            {
                test: /\.(png|jpg|gif)$/i,
                // 资源模块类型
                type: 'asset',
                // 自定义输出文件名
                generator: {
                    // hash：对模块内容做算法计算，得到映射的数字字母组合的字符串
                    // ext：使用当前模块原本的占位符，例如：.png、.jpg等字符串
                    // query：保留引入文件时代码中查询参数（只有URL下生效）
                    filename: 'assets/[hash][ext][query]'
                }
            }
        ],
    },
    optimization: {
        minimizer: [
            // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
            `...`,
            new CssMinimizerPlugin(),
        ],
        splitChunks: {
            chunks: 'all',  // 意味着chunk可以在异步和非异步chunk之间共享
            cacheGroups: {
                // 抽取为公共模块
                commons: {
                    minSize: 0, // 生成 chunk 的最小体积（以 bytes 为单位）
                    minChunks: 2,  // 拆分前必须共享模块的最小 chunks 数。
                    // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块。
                    reuseExistingChunk: true,
                    // 模块名
                    name(module, chunks, cacheGroupKey) {
                        // 公共js模块的文件夹名称
                        const moduleFileName = module
                            .identifier()
                            .split('/')
                            .reduceRight((item) => item);
                        const allChunksNames = chunks.map((item) => item.name).join('~');
                        return `./js/${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
                    },
                }
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
};

if (process.env.NODE_ENV === 'development') {
    config.devtool = 'inline-source-map'
}

if (process.env.NODE_ENV === 'production') {
    // 外部扩展（让 webpack 防止 import 的包被打包进来）
    config.externals = {
        // key为import from 语句后面的字符串
        // value是import语句被替换后，留在原地的全局变量，建议和cdn在全局暴露的变量一致
        // 例如：import axios from 'axios' 被替换为  const axios = window.axios
        'axios': 'axios'
    }
}

module.exports = config