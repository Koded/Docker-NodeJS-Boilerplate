var Docker = require("dockerode");
var _ = require("lodash");
var Promise = require('es6-promise').Promise;

var docker;

var getContainer = function(options) {
  return new Promise(function(resolve, reject) {

    docker.listContainers({all: true}, function(err, containers) {

      var existingContainer = _.find(containers, function(containerInfo) {
        return _.indexOf(containerInfo.Names, '/' + options.containerName) >= 0 ? true : false
      });

      if ( existingContainer ) {
        options.logger.writeln("Found existing container: " + existingContainer.Id);
      }
      else {
        existingContainer = null;
      }

      resolve({
        container: existingContainer,
        config: options
      });
    });
  });
};

var createContainer = function(options) {

  options.config.logger.writeln("Creating new container from image: " + options.config.containerName);

  return new Promise(function(resolve, reject) {

    docker.createContainer({
      name: options.config.containerName,
      Image: options.config.image,
      'Volumes': {
        '/bundle': {}
      },
      'PortBindings': { "8080/tcp": [{ "HostPort": "31025" }] },
      'Binds': ['/opt/app:/bundle']
    }, function(err, container) {

      if ( err ) {
        reject(err);
        return;
      }

      container.start({}, function(err, data) {

        options.config.logger.writeln("Container " + container.id + " running.");

        resolve({
          container: container,
          config: options.config
        })
      });
    });
  });
};

function runExec(container) {
  options = {
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
    Cmd: ['env']
  };
  container.exec(options, function(err, exec) {
    if (err) return;

    exec.start(function(err, stream) {
      if (err) return;

      stream.setEncoding('utf8');
      stream.pipe(process.stdout);
    });
  });
}


var restartContainer = function(options) {
  return new Promise(function(resolve, reject) {

    var container = docker.getContainer(options.container.Id);

    container.restart(function(err, data) {
      if ( err ) {
        reject(err);
      }

      options.config.logger.writeln("Container restarted.");

      container.inspect(function(err, data) {

        console.log("Running: " + data.State.Running);

        console.log(options.config.host.protocol + "://" + options.config.host.host);
        console.log(data.HostConfig.PortBindings);

        resolve({
          container: container,
          config: options.config
        });
      });
    });
  });
};

var killContainer = function(options) {
  return new Promise(function(resolve, reject) {

    var container = docker.getContainer(options.container.Id);

    container.remove(function(err, data) {

      console.log("Removing old: " + options.container.Id);

      if ( err ) {
        reject(err);
      }

      resolve({
        container: container,
        config: options.config
      });
    });
  });
};


var ensureCurrent = function(options) {

  if ( options.container ) {
    return restartContainer(options);
  }
  else {
    return createContainer(options);
  }
};


module.exports = function(grunt) {
console.log(grunt);
  grunt.registerTask('docker', 'Log stuff.', function() {

    var options = this.options({
    });

    docker = new Docker(options.host);

    options.logger = grunt.log;

    var done = this.async();

    getContainer(options).then(ensureCurrent).then(function(container) {

      done();
    }, function(err) {
      grunt.error(err);
    });
  });
};
