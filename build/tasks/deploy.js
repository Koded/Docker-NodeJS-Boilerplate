var plan = require('flightplan');
var path = require('path');


module.exports = function(grunt) {

  grunt.registerMultiTask('deploy', 'Log stuff.', function () {

    var done = this.async();
    var files = this.files;
    var options = this.options({

    });

    var deployFiles = [];

    plan.target(this.target, {
      host: options.host,
      username: options.username,
      privateKey: options.privateKey
    });

    plan.local(function(transport) {

      files.forEach(function(file) {
        deployFiles.push(file.src);
      });

      transport.transfer(deployFiles, options.dest);
      done();
    });

    plan.run('default', this.target);
  });
}