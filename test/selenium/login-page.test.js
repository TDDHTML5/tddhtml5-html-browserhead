var config = require('../lib/config').saucelabs,
    async = require('async'),
    webdriver = require('wd');

var browser = webdriver.remote(config.host, config.port, config.username, config.accessKey);

browser.on('status', function(info){
  console.log('\x1b[36m%s\x1b[0m', info);
});
browser.on('command', function(meth, path){
  console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
});

var buster = require('buster');

buster.testRunner.timeout = 30000;

buster.testCase('Login Page', {
  'page should load': function(done) {
    var desired = {
      browserName:'chrome'
      , tags: ["examples"]
      , name: "Sauce Connect Test"
    };

    browser.init(desired, function() {
      browser.get('http://localhost:8888', function() {
        browser.title(function(err, title) {
          assert.equals(title, 'Google');
          browser.quit();
          done();
        });
      });
    });
  }
});