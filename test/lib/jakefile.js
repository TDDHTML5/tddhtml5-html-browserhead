/*global desc, task, jake, fail, complete, namespace */

var config = require(__dirname + '/config');

(function() {
  'use strict';

  task('default', ['lint']);

  desc('Lint our layouts, views, and templates');
  task('lint', function() {
    var lintConfig = config.lint.html;

    var severityArray = ['STRUCTURE', 'HELPER', 'FLUFF'];
    var severityIndex = typeof lintConfig.severity === 'undefined' ? 2 : lintConfig.severity;

    //default to the strictest linting
    var severity = severityArray[ severityIndex ];

    //get the correct files for linting
    var files = new jake.FileList();
    files.include(lintConfig.files.src);
    files.exclude(lintConfig.files.exclude);

    var fileNames = files.toArray();

    for(var i = 0, l = fileNames.length; i < l; i++) {
      var exec = jake.createExec(
        [ 'perl ' + lintConfig.linterPath + '/html_lint.pl ' + severity + ' ' + fileNames[i] ],
        { stdout: true }
      );

      exec.addListener('cmdEnd', function() {
        //since we only execute 1 command we don't need to count the number
        //  of commands to determine when we're done.  just finish.
        complete();
      });

      exec.addListener('error', function(msg, code) {
        //just add a blank space to make the output more readable
        console.log('');
        //fail the Jake test
        fail(msg, code);
        complete();
      });

      exec.run();
    }

  }, {async: true});
}());