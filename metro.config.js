const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// ensure this matches the path to the globals.css file in the app directory...
module.exports = withNativeWind(config, { input: "./app/globals.css" });
