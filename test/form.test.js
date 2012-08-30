/*global describe, it, beforeEach, afterEach, WebPage */

'use strict';

if (typeof module == "object" && typeof require == "function") {
  var buster = require('buster');
}

buster.testCase('Login Form', {
  setUp: function(done) {
    var self = this;

    $('body').load(buster.env.contextPath + '/form', function() {
      //jQuery selector
      self.$form = $('form#login');
      //DOM element
      self.form = self.$form.get(0);

      done();
    });
  },

  'exists': function() {
    assert(this.$form.length);
  },

  'method is POST': function() {
    assert.equals('post', this.$form.attr('method').toLowerCase());
  },

  'action is /login': function() {
    assert.match(this.form, {
      action: '/login'
    });
  },

  'has a username input first': function() {
    var usernameInput = this.$form.children(':first').get(0);
    assert.match(usernameInput, {
      tagName: 'INPUT',
      name: 'username'
    });
  }
});