var Docker = require('dockerode');


/**
 * CX Partners website build file
 */

var path = require('path');
var cp = require('child_process');
var fs = require('fs');
var _ = require('lodash');
var extend = require('extend');

module.exports = function (grunt) {

  'use strict';

  require('load-grunt-tasks')(grunt);


  // Load grunt config from the grunt/config directory
  require('load-grunt-config')(grunt, {

    configPath: path.join(process.cwd(), 'build/config'),

    // auto grunt.initConfig
    init: true,

    // data passed into config.
    data: {

      aliases: grunt.file.readYAML('./build/aliases.yaml'),

      /*
       * Read options from external JSON files
       */
      pkg: grunt.file.readJSON('package.json'),

      core: grunt.file.readYAML('./config.yaml'),
      env: process.env.ENV || "development"

    },

    preMerge: function(config, data) {
      var envConfig;

      if ( fs.existsSync("config." + data.env + ".yaml") ) {
        envConfig = grunt.file.readYAML("config." + data.env + ".yaml");
        _.defaults(data.core, envConfig);
        extend(true, data.core, envConfig);
      }
    },

    postProcess: function(config) {
    }

  });

  // Load grunt tasks from the grunt/tasks directory
  grunt.loadTasks('build/tasks');

};

