const { config } = require('@swc/core/spack');

module.exports = config({
  entry: {
    main: './src/main.ts',
  },
  output: {
    path: __dirname + '/dist/',
    name: 'main.js'
  },
  mode: 'production'
});
