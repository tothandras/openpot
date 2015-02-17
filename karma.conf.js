module.exports = function(config) {
  config.set({
    basePath: './static',
    frameworks: ['jasmine'],
    files: [
      '**/libs.js',
      '**/scripts.js',
      '**/tests.js'
    ],

    port: 9876,
    reporters: ['progress'],
    colors: true,

    // Continuous Integration mode
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,
    singleRun: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['PhantomJS']
  });
};
