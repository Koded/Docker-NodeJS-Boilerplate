module.exports = {
  options: {
    host: {
      protocol: 'http',
      host: '<%= core.docker_api.host %>',
      port: '<%= core.docker_api.port %>'
    },
    'image': 'cxp-nodejs',
    'containerName': 'my-nodejs-app'
  }
};