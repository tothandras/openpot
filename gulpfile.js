var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

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
var WATCH = p.util.env.watch != null;
// --browsers=Chrome
var KARMA_BROWSERS = p.util.env.browsers ?
    p.util.env.browsers.trim().split(',') : ['PhantomJS'];

if (IS_RELEASE_BUILD) {
    console.log(p.util.colors.red('Building release version...'));
}

if (WATCH) {
    console.log(p.util.colors.green('Watching file changes...'));
}

/** configuration */
var config = {};
config.banner =
    '/**\n' +
    '*\t@author Andras Toth <andras.toth93@gmail.com>\n' +
    '*\t@url https://github.com/tothandras/openpot\n' +
    '*\t@license MIT\n' +
    '*/\n';
config.paths = {
    client: 'client',
    build: 'static',
    script: 'script',
    style: 'style',
    font: 'fonts'
};
config.files = {
    index: config.paths.client + '/' + 'src/index.html',
    template: config.paths.client + '/' + 'src/**/*.tpl.html',
    typescript: {
        src: [
            config.paths.client + '/' + 'src/**/*.module.ts',
            config.paths.client + '/' + 'src/**/!(*.test).ts'
        ],
        typings: [config.paths.client + '/' + 'typings/**/*.d.ts'],
        test: [config.paths.client + '/' + 'src/**/*.test.ts']
    },
    sass: config.paths.client + '/' + 'src/**/*.scss'
};
config.karma = {
    action: 'run',
    configFile: __dirname + '/karma.conf.js',
    singleRun: !WATCH,
    autoWatch: WATCH,
    browsers: KARMA_BROWSERS
};
config.port = '8030';

/** tasks */
gulp.task('clean', function() {
    p.del(config.paths.build, function(err) {
        if (err != null) {
            p.util.log(err);
        }
    });
});

gulp.task('lint-ts', function() {
    var tsFiles = config.files.typescript.src
        .concat(config.files.typescript.test);

    gulp.src(tsFiles)
        .pipe(p.plumber())
        .pipe(p.tslint())
        .pipe(p.tslint.report('full'));
});

gulp.task('build-ts', ['lint-ts'], function() {
    var tsFiles = config.files.typescript.src
        .concat(config.files.typescript.typings);

    var tsConfig = {
        noExternalResolve: true,
        sortOutput: true,
        target: 'ES5'
    };

    var ts = gulp.src(tsFiles)
        .pipe(p.plumber())
        .pipe(p.sourcemaps.init())
        .pipe(p.typescript(tsConfig));

    // config
    var cfg = p.ngConstant({
            name: 'config',
            constants: {
                RELEASE: IS_RELEASE_BUILD
            },
            stream: true
        });

    // template
    var tpl = gulp.src(config.files.template)
        .pipe(p.plumber())
        .pipe(p.rename({
            dirname: ''
        }))
        .pipe(p.angularTemplatecache({
            module: 'template',
            standalone: true
        }));

    // test files
    if (!IS_RELEASE_BUILD) {
        var tsTestFiles = config.files.typescript.test
            .concat(config.files.typescript.typings);
        gulp.src(tsTestFiles)
            .pipe(p.plumber())
            .pipe(p.typescript(tsConfig))
            .pipe(p.concat('tests.js'))
            .pipe(gulp.dest(config.paths.script, {cwd: config.paths.build}));
    }

    return p.mergeStream(ts.js, cfg, tpl)
        .pipe(p.plumber())
        .pipe(p.concat('scripts.js'))
        .pipe(IS_RELEASE_BUILD ? p.ngAnnotate({
            single_quotes: true
        }) : p.util.noop())
        .pipe(IS_RELEASE_BUILD ? p.uglify() : p.util.noop())
        .pipe(p.insert.prepend(config.banner))
        .pipe(IS_RELEASE_BUILD ? p.rev() : p.sourcemaps.write())
        .pipe(gulp.dest(config.paths.script, {cwd: config.paths.build}))
        .pipe(reload({stream:true}));
});

gulp.task('build-lib', function() {
    var bowerFiles = gulp.src(p.mainBowerFiles({
        env: IS_RELEASE_BUILD ? 'production' : 'development'
    }));
    var js = bowerFiles
        .pipe(p.filter('*.js'));

    var css = bowerFiles
        .pipe(p.filter('*.css'));

    var font = bowerFiles
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

    return p.mergeStream(js, css, font)
        .pipe(reload({stream:true}));
});

gulp.task('build-sass', function() {
    return gulp.src(config.files.sass)
        .pipe(p.plumber())
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
        .pipe(gulp.dest(config.paths.style, {cwd: config.paths.build}))
        .pipe(reload({stream:true}));
});

gulp.task('build-index', ['build-ts', 'build-sass', 'build-lib'], function() {
    var files = gulp.src([
        '**/lib*.js',
        '**/scripts*.js',
        '**/*.css'
    ], {cwd: config.paths.build, read: false});
    return gulp.src(config.files.index)
        .pipe(p.inject(files, {addRootSlash: false}))
        .pipe(gulp.dest(config.paths.build))
        .pipe(reload({stream:true}));
});

gulp.task('build', ['build-ts', 'build-sass', 'build-lib', 'build-index']);

gulp.task('watch', function() {
    if (WATCH) {
        gulp.watch(config.files.typescript.src, ['build-ts']);
        gulp.watch(config.files.typescript.test, ['build-ts']);
        gulp.watch(config.files.template, ['build-ts']);
        gulp.watch(config.files.index, ['build-index']);
        gulp.watch(config.files.sass, ['build-sass']);
        gulp.watch(config.paths.client + '/lib/**', ['build-lib']);
    }
});

gulp.task('test-karma', ['build-ts', 'build-lib'], function(done){
    if (!IS_RELEASE_BUILD) {
        p.karma.server.start(config.karma, done);
    }
});

gulp.task('browser-sync', function() {
    if (WATCH) {
        browserSync({
            notify: false,
            open: false,
            proxy: 'localhost:' + config.port
        });
    }
});

gulp.task('default', ['clean', 'build', 'watch', 'test-karma', 'browser-sync']);
