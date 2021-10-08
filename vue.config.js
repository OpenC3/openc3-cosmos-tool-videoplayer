const { resolve } = require('path');

const SystemJSPublicPathWebpackPlugin = require("systemjs-webpack-interop/SystemJSPublicPathWebpackPlugin");

const packageJsonPath = resolve("package.json");
const { name } = require(packageJsonPath);
if (!name) {
  throw Error(
    `could not determine package name -- change your package json name field`
  );
}

module.exports = {
  css: {
    extract: false,
  },  
  publicPath: '/tools/videoplayer',
  outputDir: 'tools/videoplayer',
  filenameHashing: false,
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    devServer: {
      port: 2917,
      watchOptions: {
        ignored: ['node_modules'],
        aggregateTimeout: 300,
        poll: 1500,
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      disableHostCheck: true,
      public: 'localhost:2917/tools/videoplayer',
    },
  },
  chainWebpack(config) {
    config.module
      .rule('js')
      .use('babel-loader')
      .tap((options) => {
        return {
          rootMode: 'upward',
        }
      })
      
    config.externals([
      'portal-vue',
      'single-spa',
      'vue',
      'vuejs-dialog',
      'vuetify',
      'vuex',
      'vue-router',
    ])

    config.optimization.delete("splitChunks");

    config.output.libraryTarget("umd");

    config.output.devtoolNamespace(name);

    config.set("devtool", "sourcemap");

    config
      .plugin("SystemJSPublicPathWebpackPlugin")
      .use(SystemJSPublicPathWebpackPlugin, [
        {
          rootDirectoryLevel: 2,
          systemjsModuleName: name,
        },
      ]);

    config.output.set("jsonpFunction", `webpackJsonp__${name}`);    
  },
}
