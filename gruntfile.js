module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint:
    {
      options:
      {
        undef: true,
        strict:true,
        jasmine: true,
        unused: true,
        node: true,
        esnext: true,
        reporter: require('jshint-stylish')
      },
      src: ['tmp/**/*.js', '!tmp/public/**']
    },
    clean:
    {
      all: ['tmp/', './build']
    },
    copy: {
      all:
      {
        files: [
        {
          expand: true,
          cwd: 'server/',
          src: '**',
          dest: 'tmp'
        },
        {
          expand: true,
          cwd: 'public/',
          src: '**',
          dest: 'tmp/public'
        }]
      }
    },
    injector: {
      options: {

      },
      // Inject application script files into index.html (doesn't include bower)
      all: {
        js:
        {
          options: {
            transform: function(filePath) {
              filePath = filePath.replace('public/', '');
              filePath = filePath.replace('/tmp/', '');

              return '<script src="' + filePath + '"></script>';
            },
            starttag: '<!-- injector:js -->',
            endtag: '<!-- endinjector -->',
          },
          files: {
            'tmp/public/index.html': [
                 [
                   
                   'tmp/public/source/**/*.js',
                   // 'public/source/*js',
                   // 'public/source/plugins/wyliodrin.menubar/*.js'
                 ]
              ]
          }
        },
        css:
        {
          options: {
            transform: function(filePath) {
              filePath = filePath.replace('public/', '');
              filePath = filePath.replace('/tmp/', '');

              return '<link rel="stylesheet" type="text/css" href=' + filePath + '>';
            },
            starttag: '<!-- injector:css -->',
            endtag: '<!-- endinjector -->',
          },
          files: {
            'tmp/public/index.html': [
                 [
                   
                   'tmp/public/css/*.css',
                 ]
              ]
          }
        }
      }
    },
    uglify:
    {
      options:
      {
        compress: true,
        mangle: true,
        mangleProperties: false
      },
      server:
      {
        files: [{
          expand: true,
          cwd: 'tmp/',
          src: ['**/*.js', '!**/tests/*'],
          dest: 'tmp/',
        }]
      }
    },
    wiredep: {
      client: {
        cwd: 'tmp/public',
        src: 'tmp/public/index.html',
        ignorePath: '',
        exclude: []
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-wiredep');

  // Default task(s).
  grunt.registerTask('build', ['clean', 'copy', 'jshint', 'wiredep']);

};