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
    }
  }
};