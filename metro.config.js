// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
    const config = getDefaultConfig(__dirname);
    // allow .cjs so Expo Router’s loader polyfill (global.require) runs
    config.resolver.sourceExts.push("cjs");
    return config;
})();
