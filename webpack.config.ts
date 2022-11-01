import {Configuration} from 'webpack';
import {DevConfiguration} from '@expo/webpack-config/webpack/types';

const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
// const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

module.exports = async function (env, argv) {
  // Set by expo-cli during `expo build:web`
  const isEnvProduction = env.mode === 'production';

  // Create the default config
  const config: Configuration | DevConfiguration = await createExpoWebpackConfigAsync(env, argv);

  if (isEnvProduction && config.optimization && config.plugins) {
    config.optimization.splitChunks = false;
    config.optimization.runtimeChunk = false;
    config.optimization.namedChunks = false;
    config.optimization.minimize = true;
    config.optimization.removeEmptyChunks = true;
    config.devtool = false;

    /*if (config.module) {
      config.module.rules = [
        {
          test: /.tsx|.ts/,
          exclude: /node_modules\/@rnmapbox\/maps/,
        },
      ];
    }*/

    // config.resolve.alias = {
    // react: path.resolve('./node_modules/react'),
    // };

    // config.resolve.modules = [
    //   path.resolve(__dirname, 'node_modules'),
    //   path.resolve(__dirname, 'node_modules/bn.js/lib'),
    //   path.resolve(__dirname, 'node_modules/ethereumjs-util'),
    //   path.resolve(__dirname, 'node_modules/web3-utils'),
    // ];

    config.plugins.push(
      // Generate a service worker script that will precache, and keep up to date,
      // the HTML & assets that are part of the webpack build.
      new WorkboxWebpackPlugin.InjectManifest({
        swSrc: path.resolve(__dirname, './src/service-worker.js'),
        dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
        exclude: [
          /\.map$/,
          /asset-manifest\.json$/,
          /LICENSE/,
          /\.js\.gz$/,
          // Exclude all apple touch and chrome images because they're cached locally after the PWA is added.
          /(apple-touch-startup-image|chrome-icon|apple-touch-icon).*\.png$/,
        ],
        // Bump up the default maximum size (2mb) that's precached,
        // to make lazy-loading failure scenarios less likely.
        // See https://github.com/cra-template/pwa/issues/13#issuecomment-722667270
        maximumFileSizeToCacheInBytes: 1024 * 1024,
      }),
    );

    /*config.plugins.push(
      new BundleAnalyzerPlugin({
        path: 'web-report',
      }),
    );*/
  }

  return config;
};
