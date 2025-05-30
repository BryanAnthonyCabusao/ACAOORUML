const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  ws: path.resolve(__dirname, './emptyModule.js'),
  events: path.resolve(__dirname, './emptyModule.js'),
  net: path.resolve(__dirname, './emptyModule.js'),
  tls: path.resolve(__dirname, './emptyModule.js'),
  crypto: path.resolve(__dirname, './emptyModule.js'),
  http: path.resolve(__dirname, './emptyModule.js'),
  https: path.resolve(__dirname, './emptyModule.js'),
  stream: path.resolve(__dirname, './emptyModule.js'),
  buffer: path.resolve(__dirname, './emptyModule.js'),
  url: path.resolve(__dirname, './emptyModule.js'), 
};

module.exports = config;
