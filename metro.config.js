const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Workaround: evita resolver entradas ESM con import.meta vía package.json "exports"
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
