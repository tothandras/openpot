/* TODO
*   gulp-plumber
*   karma!!
*   watch
*   minify images
*   copy fonts
*/
var gulp = require('gulp');

/** gulp plugins & dependencies */
var p = require('gulp-load-plugins')({
    pattern: [
        'gulp-*',
        'karma',
        'main-bower-files',
        'del',
        'merge-stream'
    ]
});

/** arguments */
// --release
var IS_RELEASE_BUILD = p.util.env.release != null;
// --watch
var KARMA_WATCH = p.util.env.watch != null;
// --browsers=Chrome
var KARMA_BROWSERS = p.util.env.browsers ?
    p.util.env.browsers.trim().split(',') : ['PhantomJS']

if (IS_RELEASE_BUILD) {
    console.log(p.util.colors.red('Building release version...'));
}

/** configuration */
var config = {
    banner:
        '/**\n' +
        '*\t@author Andras Toth <andras.toth93@gmail.com>\n' +
        '*\t@url https://github.com/tothandras/go-ng-chat\n' +
        '*\t@license MIT\n' +
        '*/\n',
    paths: {
        client: 'client',
        build: 'static',
        script: 'script',
        style: 'style',
        font: 'font'
    },
    files: {
        index: 'src/index.html',
        template: 'src/**/*.tpl.html',
        typescript: [
            'typings/**/*.d.ts',
            'src/**/*!(test).ts',
        ],
        test: 'src/**/*.test.ts',
        sass: 'src/**/*.scss'
    },
    karma: {
        action: 'run',
        configFile: __dirname + '/karma.conf.js',
        singleRun: !KARMA_WATCH,
        autoWatch: KARMA_WATCH,
        browsers: KARMA_BROWSERS
    }
}

/** tasks */
gulp.task('clean', function() {
    p.del(config.paths.build, function(err) {
        if (err != null) {
            p.util.log(err);
        }
    });
});

gulp.task('lint-ts', function() {
    return gulp.src(config.files.typescript, {cwd: config.paths.client})
        .pipe(p.tslint())
        .pipe(p.tslint.report('verbose', {
            emitError: false
        }));
});

////////////////////////////////////////////////////////////////////////////////
//  Build tasks
////////////////////////////////////////////////////////////////////////////////

var tsProject;
gulp.task('build-script', ['lint-ts'], function() {

    // typescript
    if (tsProject == null) {
        tsProject = p.typescript.createProject({
            noExternalResolve: true,
            sortOutput: true,
            target: 'ES5'
        });
    }
    var tsFiles = config.files.typescript;
    // remove test files
    if (!IS_RELEASE_BUILD) {
        tsFiles = tsFiles.concat(config.files.test);
    }

    var ts = gulp.src(tsFiles, {cwd: config.paths.client})
        .pipe(p.sourcemaps.init())
        .pipe(p.typescript(tsProject));

    // config
    var cfg = p.ngConstant({
            name: 'config',
            constants: {
                RELEASE: IS_RELEASE_BUILD
            },
            stream: true
        });

    // template
    var tpl = gulp.src(config.files.template, {cwd: config.paths.client})
        .pipe(p.rename({
            dirname: ''
        }))
        .pipe(p.angularTemplatecache({
            module: 'template',
            standalone: true
        }));

    return p.mergeStream(ts.js, cfg, tpl)
        .pipe(p.concat('scripts.js'))
        .pipe(IS_RELEASE_BUILD ? p.ngAnnotate({
            single_quotes: true
        }) : p.util.noop())
        .pipe(IS_RELEASE_BUILD ? p.uglify() : p.util.noop())
        .pipe(p.insert.prepend(config.banner))
        .pipe(IS_RELEASE_BUILD ? p.rev() : p.sourcemaps.write())
        .pipe(gulp.dest(config.paths.script, {cwd: config.paths.build}));
});

gulp.task('build-lib', function() {
    var js = gulp.src(p.mainBowerFiles())
        .pipe(p.filter('*.js'));

    var css = gulp.src(p.mainBowerFiles())
        .pipe(p.filter('*.css'));

    var font = gulp.src(p.mainBowerFiles())
        .pipe(p.filter([
            '*.eot',
            '*.svg',
            '*.ttf',
            '*.woff',
            '*.woff2',
            '*.otf'
        ]));

    js
        .pipe(p.concat('libs.js'))
        .pipe(IS_RELEASE_BUILD ? p.rev() : p.util.noop())
        .pipe(gulp.dest(config.paths.script, {cwd: config.paths.build}));

    css
        .pipe(p.concat('libs.css'))
        .pipe(IS_RELEASE_BUILD ? p.rev() : p.util.noop())
        .pipe(gulp.dest(config.paths.style, {cwd: config.paths.build}));

    font
        .pipe(gulp.dest(config.paths.font, {cwd: config.paths.build}));

    return p.mergeStream(js, css, font);
});

gulp.task('build-sass', function() {
    return gulp.src(config.files.sass, {cwd: config.paths.client})
        .pipe(p.sourcemaps.init())
        .pipe(p.sass({
            outputStyle: IS_RELEASE_BUILD ? 'compressed' : 'compact',
            errLogToConsole: true
        }))
        .pipe(p.autoprefixer({
            browsers: [
                'last 2 versions',
                'last 4 Android versions'
            ]
        }))
        .pipe(p.concat('styles.css'))
        .pipe(p.insert.prepend(config.banner))
        .pipe(IS_RELEASE_BUILD ? p.rev() : p.sourcemaps.write())
        .pipe(gulp.dest(config.paths.style, {cwd: config.paths.build}));
});

gulp.task('build-index', ['build-script', 'build-sass', 'build-lib'], function() {
    var files = gulp.src([
        '**/lib*.js',
        '**/scripts*.js',
        '**/*.css'
    ], {cwd: config.paths.build, read: false});
    return gulp.src(config.files.index, {cwd: config.paths.client})
        .pipe(p.inject(files, {addRootSlash: false}))
        .pipe(gulp.dest(config.paths.build));
});

gulp.task('build', ['build-script', 'build-sass', 'build-lib', 'build-index'])

////////////////////////////////////////////////////////////////////////////////
//  Unit and end-to-end test tasks
////////////////////////////////////////////////////////////////////////////////

gulp.task('test-karma', ['build-script', 'build-lib'], function(done){
    p.karma.server.start(config.karma, done);
});

gulp.task('default', ['clean', 'build'])
