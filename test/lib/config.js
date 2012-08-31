var fs = require('fs');

module.exports = {
  lint: {
    html: {
      files: {
        src: [
          "src/*.html",
          "src/**/*.html"
        ],
        exclude: [
          "test",
          "spec"
        ]
      },
      linterPath: "test/lib",
      severity: 0 // 0:STRUCTURE (least strict), 1:HELPER, 2:FLUFF (most strict)
    }
  },

  buster: {
    html: {
      //set our root path to be the project root
      rootPath: '../../',
      environment: "browser",
      libs: [
        //this just brings in jQuery
        "lib/*.js"
      ],
      tests: [
        //our test files
        "test/*.test.js"
      ],
      //allows us to bring in our views without firing up a server
      //@see: http://www.kraken.no/blog/2012/03/23/injecting-html-with-busterjs/
      resources: [
        { path: "/", content: fs.readFileSync('src/index.html')},
        { path: "/form", content: fs.readFileSync('src/form.html') }
      ]
    },
    selenium: {
      //set our root path to be the project root
      rootPath: '../selenium',
      environment: "node",
      tests: [
        //our test files
        "*.test.js"
      ]
    }
  },

  saucelabs: {
    username: process.env.SAUCE_USERNAME,
    accessKey: process.env.SAUCE_ACCESS_KEY,
    host: "ondemand.saucelabs.com",
    port: 80,
    processes: 10,
    maxTests: false,
    serviceName: 'sauce',
    caps: [
      {browserName: "internet explorer", version: '8', platform: "XP", proxy: {proxyType: 'direct'}, 'selenium-version': '2.21.0'},
      {browserName: "firefox", version: '10', platform: "Windows 2003", proxy: {proxyType: 'direct'}},
      {browserName: "chrome", version: '', platform: "VISTA", proxy: {proxyType: 'direct'}}
    ]

  }
};