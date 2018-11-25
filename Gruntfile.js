/* eslint-disable unicorn/filename-case */
module.exports = grunt => {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		ava: {
			nycTest: {
				nyc: true
			}
		},
		coveralls: {
			docs: {
				src: 'nyc.info'
			}
		},
		jsdoc: {
			src: ['README.md', 'src/**.js'],
			options: {
				destination: 'docs',
				template: 'node_modules/ink-docstrap/template',
				configure: 'node_modules/ink-docstrap/template/jsdoc.conf.json'
			}
		},
		xo: {
			target: ['**.js', '!node_modules/*/**.js']
		}
	});

	grunt.registerTask('default', ['xo', 'ava', 'coveralls', 'babel', 'jsdoc']);
	grunt.registerTask('build', ['babel', 'jsdoc']);
	grunt.registerTask('test', ['xo', 'ava']);
};
