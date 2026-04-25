module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@entities': './src/entities',
            '@features': './src/features',
            '@pages': './src/pages',
            '@shared': './src/shared',
            '@data': './data',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};
