const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new CopyPlugin([
      { from: '**.html', context: 'src/' },
      { from: '**.css', context: 'src/' },
    ]),
  ],
};
