var Docker = require("dockerode");
var _ = require("lodash");
var Promise = require('es6-promise').Promise;
var fstream = require("fstream");
var fs = require("fs");
var tar = require('tar-fs');

var docker = new Docker({
  protocol: 'http',
  host: '52.16.123.230',
  port: '4243'
});

// tar -cf Dockerfile.tar Dockerfile

module.exports = function(grunt) {

  grunt.registerTask('build-image', 'build docker image', function() {

    var options = this.options({
    });

    options.logger = grunt.log;

    var done = this.async();


    var tarStream = tar.pack(process.cwd() + '/docker');

      docker.buildImage(tarStream, {t: options.name}, function (err, stream){
        stream.pipe(process.stdout, {end: true});

        stream.on('end', function() {
          done();
        });

      });


  });
};
