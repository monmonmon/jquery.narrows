module.exports = (grunt) ->
    pkg = grunt.file.readJSON 'package.json'

    grunt.initConfig
        uglify:
            files:
                'jquery.narrows.min.js': 'jquery.narrows.js'
        watch:
            files: ['jquery.narrows.js'],
            tasks: ['uglify']

    for taskName of pkg.devDependencies
        if taskName.substring(0, 6) is 'grunt-'
            grunt.loadNpmTasks taskName

    grunt.registerTask 'default', ['uglify', 'watch']
