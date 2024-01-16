const path = require('path');

module.exports = {
  entry: './src/background.js', // Replace with your entry file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode:'production',
  resolve: {
    fallback: {
      fs: false, // Disable 'fs' module, common in Node.js packages
      stream: require.resolve('stream-browserify'),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      "url": require.resolve("url/"),
      "buffer": require.resolve("buffer/"),
      "timers": require.resolve("timers-browserify"),
      "querystring": require.resolve("querystring-es3"),
      "vm": require.resolve("vm-browserify")
    },
  },
};
