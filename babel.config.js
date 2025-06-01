module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // 👇 Siempre debe ir como último plugin, sin opciones
      "react-native-reanimated/plugin",
    ],
  };
};
