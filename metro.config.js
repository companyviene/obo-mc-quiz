const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// lucide-react-native v1+ exports:
//   "import"  → dist/esm/*.mjs   (ESM — Metro cannot resolve internal .mjs files)
//   "require" → dist/cjs/*.js    (CJS — works fine)
//
// Expo SDK 54 enables package-exports resolution by default and picks "import".
// Removing "import" and "browser" from the condition list forces Metro to use
// the "require" (CJS) build instead.
config.resolver.unstable_conditionNames = [
  "react-native",
  "require",
  "default",
];

// Keep .mjs in sourceExts as a safety net for other ESM-only packages.
config.resolver.sourceExts.push("mjs");

// qrcode ships a Node-only server entry (requires ./renderer/png) that Metro
// would pick up because we disabled the "browser" condition above.
// Explicitly redirect qrcode to its browser-safe build.
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  qrcode: path.resolve(__dirname, "node_modules/qrcode/lib/browser.js"),
};

module.exports = config;
