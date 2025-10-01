module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }], // NativeWind JSX import
      "nativewind/babel", // NativeWind plugin
    ],
    plugins: [
      "react-native-reanimated/plugin", 
    ],
  };
};
