module.exports = {
  options: {
    host: '<%= core.deploy.host %>',
    username: "ubuntu",
    privateKey: process.env.HOME + '/.ssh/CXMac.pem',
    dest: "/opt/"
  },
  app: {
    options: {
    },
    files: [{
      expand: true,
      filter: 'isFile',
      cwd: 'app',
      src: ['**/*'],
      dest: './'
    }]
  }
};
