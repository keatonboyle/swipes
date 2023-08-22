const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: '**.html', context: 'src/' },
        { from: '**.css', context: 'src/' },
      ],
    }),
  ],
};
