module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-transform-optional-chaining',
      '@babel/plugin-transform-optional-catch-binding',
      'react-native-reanimated/plugin',
    ],
  };
};