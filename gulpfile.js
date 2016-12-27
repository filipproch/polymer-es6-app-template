'use strict'

// utils
const gulp = require('gulp')
const gulpif = require('gulp-if')
const rename = require('gulp-rename')
const del = require('del')
const template = require('gulp-template')
const mergeStream = require('merge-stream')
const argv = require('yargs').argv
const notify = require('gulp-notify')
const filter = require('gulp-filter')
const uglify = require('gulp-uglify')
const htmlmin = require('gulp-htmlmin')
const logging = require('plylog')
const crypto = require('crypto')
const modRewrite = require('connect-modrewrite')
const runSequence = require('run-sequence')
const spawn = require('child_process').spawn

// babel
const babel = require('gulp-babel')

// image minifier
const imagemin = require('gulp-imagemin')

// polymer
const polymer = require('polymer-build')

// browser sync
const browserSync = require('browser-sync').create()

// Got problems? Try logging 'em
logging.setVerbose()

/**
 * Polymer stuff
 */
const PolymerProject = polymer.PolymerProject
const fork = polymer.forkStream

/**
 * Package information (package.json)
 */
const packageInfo = require('./package.json')

/**
 * Build configurations (build-config.json)
 */
const buildConfig = require('./build-config.json')

function waitFor (stream) {
  return new Promise((resolve, reject) => {
    stream.on('end', resolve)
    stream.on('error', reject)
  })
}

function appendBuildVars (appConfig) {
  appConfig[ 'version_code' ] = Date.now() + '#' + crypto.randomBytes(10).toString('hex')
  appConfig[ 'version_string' ] = packageInfo.version
  appConfig[ 'build_timestamp' ] = Date.now()
}

gulp.task('default', [ 'build' ])

gulp.task('config', () => {
  let targetEnv = argv.env ? argv.env : buildConfig[ 'defaultEnv' ]
  let pipe = gulp.src('./template/config.js.tmpl')

  let appConfig = Object.assign(buildConfig[ 'globalVars' ], buildConfig[ 'environments' ][ targetEnv ])

  appendBuildVars(appConfig)

  return pipe.pipe(template({
    app_config: JSON.stringify(appConfig)
  }))
    .pipe(rename('config.js'))
    .pipe(gulp.dest('./app/scripts/generated/'))
})

gulp.task('serve', (done) => {
  runSequence('config', 'browser-sync', 'watch', done)
})

gulp.task('test', (done) => {
  // todo: execute tests
  done()
})

gulp.task('browser-sync', () => {
  let targetEnv = argv.env ? argv.env : buildConfig[ 'defaultEnv' ]
  let envConf = buildConfig[ 'environments' ][ targetEnv ]

  browserSync.init({
    server: {
      baseDir: envConf[ 'baseDir' ],
      middleware: [
        modRewrite([
          '!\\.\\w+$ /index.html [L]'
        ])
      ]
    },
    port: envConf[ 'port' ] ? envConf[ 'port' ] : 8080
  })
})

gulp.task('watch', () => {
  gulp.watch('./app/**/*', () => browserSync.reload())
})

gulp.task('clean', () => {
  return del('build')
})

gulp.task('deploy', (done) => {
  runSequence('build', 'deploy-firebase', done)
})

gulp.task('deploy-firebase', (callback) => {
  let project = argv.prod ? 'settle-up-live' : 'settle-up-sandbox'
  let token = process.env[ 'FIREBASE_TOKEN' ]

  if (!token) {
    throw new Error("Failed, you must have environment variable FIREBASE_TOKEN set")
  }

  let args = [ 'deploy', '--project', project, '--token', token ]
  let cmd = spawn('./node_modules/.bin/firebase', args, { stdio: 'inherit' })
  return cmd.on('close', callback)
})

gulp.task('build', (done) => {
  runSequence('clean', 'config', 'polymer-build', done)
})

gulp.task('polymer-build', () => {
  let polymerJSON = require('./polymer.json')
  let project = new PolymerProject(polymerJSON)

  let sources = project.sources()
    .pipe(project.splitHtml())
    .pipe(gulpif('*.js', babel({
      presets: [ 'es2015' ]
    })))
    .pipe(gulpif('*.js', uglify({
      mangle: false
    })))
    .pipe(gulpif('*.html', htmlmin({
      collapseWhitespace: true,
      caseSensitive: true,
      minifyCSS: true
    })))
    .pipe(gulpif('*.{png,gif,jpg,svg}', imagemin({
      progressive: true, interlaced: true
    })))
    .pipe(project.rejoinHtml())

  console.log('sources processed')

// process dependencies
  let dependencies = project.dependencies()
    .pipe(project.splitHtml())
    .pipe(project.rejoinHtml())

  console.log('deps processed')

// merge the source and dependencies streams to we can analyze the project
  let allFiles = mergeStream(sources, dependencies)
    .pipe(project.analyzer)

  console.log('stream merged')

// fork the stream in case downstream transformers mutate the files
// this fork will vulcanize the project
  let bundledPhase = fork(allFiles)
    .pipe(project.bundler)
    // write to the bundled folder
    .pipe(gulp.dest('build/bundled'))

  let unbundledPhase = fork(allFiles)
  // write to the unbundled folder
    .pipe(gulp.dest('build/unbundled'))

  return Promise.all([ waitFor(unbundledPhase), waitFor(bundledPhase) ])
})
