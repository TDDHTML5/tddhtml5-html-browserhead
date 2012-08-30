/*global describe, it, beforeEach, afterEach, WebPage */

'use strict';

if (typeof module == "object" && typeof require == "function") {
  var buster = require('buster');
}

var counter = 0;

buster.testCase('Main Layout', {
  setUp: function(done) {
    var self = this;

    $.get(buster.env.contextPath + '/', function(data) {
      self.data = data;

      var iframeId = 'testFrame' + (++counter);

      //add an iframe to run our tests in to be sure the DOM from other tests doesn't interfere
      $('<iframe>', {
        id: iframeId
      }).appendTo('body');

      var iframe = document.getElementById(iframeId);

      self.iframe = $(iframe);
      self.context = iframe.contentWindow.document;

      try {
        self.context.documentElement.innerHTML = data;
      } catch(e) {
        //for IE
        self.context.open();
        self.context.write(data);
        self.context.close();
      }

      done();
    });
  },

  tearDown: function() {
    this.iframe.remove();
  },

  'has an HTML5 doctype': function() {
    var doctype = '<!doctype html>';
    var writtenDoctype = this.data.substr(0, doctype.length).toLowerCase();
    assert.equals(writtenDoctype, doctype);
  },

  //no need to test that it has a HEAD, TITLE, and BODY since linting checks for those

  'head': {
    'title is a handlebars "title" placeholder': function() {
      assert.equals('{{title}}', $('head title').text());
    }
  },

  'body': {
    setUp: function() {
      this.$body = $('body', this.context);
      this.body = this.$body.get(0);

      this.bodyChildren = this.$body.children();
    },

    'has a HEADER tag as its first child': function() {
      assert.equals(this.$body.children(':first').get(0).tagName, 'HEADER');
    },

    'header': {
      setUp: function() {
        this.$header = this.$body.find('header:first');
      },

      'has the title H1 element as its first child': function() {
        assert.match(this.$header.children(':first').get(0), {
          tagName: 'H1',
          innerHTML: 'My Great App'
        });
      }
    },

    'has a div#main after the HEADER that holds the handlebars {{{body}}} placeholder': function() {
      var mainDiv = this.$body.find('div');
      //make sure the div exists
      assert(mainDiv.filter('#main').length);
      //make sure it comes after the HEADER
      var headerPosition = -1;
      var mainDivPosition = -1;
      for(var i = 0, l = this.bodyChildren.length; i < l; i++) {
        if(this.bodyChildren.get(i).tagName === 'HEADER') {
          headerPosition = i;
        } else if (this.bodyChildren.get(i).tagName === 'DIV') {
          mainDivPosition = i;
        }
      }
      assert(mainDivPosition > headerPosition);
      //make sure the DIV has the right attributes
      assert.match(mainDiv.get(0), {
        id: 'main',
        innerHTML: '{{{body}}}'
      })
    },

    'has a FOOTER tag after the main content': function() {
      var footer = this.$body.find('footer');
      //make sure the div exists
      assert(footer.length);
      //make sure it comes after the HEADER
      var footerPosition = -1;
      var mainDivPosition = -1;
      for(var i = 0, l = this.bodyChildren.length; i < l; i++) {
        if(this.bodyChildren.get(i).tagName === 'FOOTER') {
          footerPosition = i;
        } else if (this.bodyChildren.get(i).tagName === 'DIV') {
          mainDivPosition = i;
        }
      }
      assert(footerPosition > mainDivPosition);
    },

    'footer': {
      setUp: function() {
        this.$footer = this.$body.find('footer:first');
      },

      'has the copyright info in a SMALL tag': function() {
        var copyright = this.$footer.find('small');

        assert(copyright.length);

        assert.match(copyright.get(0), {
          tagName: 'SMALL',
          //get the rendered copyright symbol and make sure it's the first thing in the SMALL tag
          innerHTML: new RegExp($('<div>&copy;</div>').text() + '.+')
        });
      }
    },

    'all SCRIPT tags come after the footer': function() {
      //make sure there are no scripts in the HEAD
      refute($('head script', this.context).length);

      if(this.$body.find('script').length) {
        //get all script positions
        var scriptPositions = [];
        var footerPosition = -1;
        for(var i = 0, l = this.bodyChildren.length; i < l; i++) {
          if(this.bodyChildren.get(i).tagName === 'FOOTER') {
            footerPosition = i;
          } else if (this.bodyChildren.get(i).tagName === 'SCRIPT') {
            scriptPositions.push(i);
          }
        }

        //make sure they're all after the footer position
        for(var i = 0, l = scriptPositions.length; i < l; i++) {
          assert.greater(scriptPositions[i], footerPosition);
        }
      }
    }
  },

  'body after handlebars parsing': {
    setUp: function(done) {
      this.dataObject = {
        title: 'Test Title',
        body: '<img src="/img/logo.png" id="logo-img" />' +
              '<h3>This is the brand slogan</h3>' +
              '<div id="banner-slider">' +
                '<div class="panel">' +
                  '<p>This app is going to change your life &smp; the world!</p>' +
                '</div>' +
                '<div class="panel">' +
                   '<img src="/img/banner-2-bg.jpg" />' +
                '</div>' +
              '</div>'
      };

      //TODO: parse the layout with the dataObject

      done();
    },

    '//title should equal this.dataObject.title': function() {
      assert.equals($('head title').text(), this.dataObject.title);
    },

    '//body should have HTML DOM nodes in div#main': function() {

    }
  }
});