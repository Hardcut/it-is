let gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    minifyJs = require('gulp-terser'),
    autoPrefixer = require('gulp-autoprefixer'),
    rigger = require('gulp-rigger'),
    bs = require('browser-sync'),
    htmlMin = require('gulp-htmlmin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    delFiles = require('del'),
    cssMinify = require('gulp-csso'),
    babel = require('gulp-babel'),
    jsonMinify = require('gulp-json-minify'),
    imagemin = require('gulp-imagemin'),
    imageminJpg = require('imagemin-jpeg-recompress'),
    imageminPng = require('imagemin-pngquant'),
    cache = require('gulp-cache');

let csslibssrc = [
  'app/sass/libs.scss'
]

let jslibssrc = [
  'app/js/libs.js'
]

gulp.task('csslibs', () => {
    return gulp.src(csslibssrc)
        .pipe(sass())
        .pipe(autoPrefixer('last 2 versions'))
        .pipe(cssMinify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('sass', () => {
    return gulp.src('app/sass/*.scss')
        .pipe(sass())
        .pipe(autoPrefixer('last 2 versions'))
        .pipe(cssMinify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/css'))
});


gulp.task('customcss', () => {
    return gulp.src('app/sass/custom.css')
        .pipe(gulp.dest('dist/css'))
});

gulp.task('image:build', () =>  {
    return gulp.src('app/img/**/*.*')
        .pipe(imagemin(
            [imageminPng(),
            imageminJpg({
                progressive: true,
                max: 85,
                min: 80
            })],
            {verbose: true}
        ))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('favicon', () =>  {
    return gulp.src('app/favicon/**/*.*')
        .pipe(gulp.dest('dist'));
});

gulp.task('info', () =>  {
    return gulp.src('app/info/**/*.*')
        .pipe(gulp.dest('dist/info'));
});

gulp.task('clean', () => {
    return delFiles('dist');
});

gulp.task('html:build', () => {
    return gulp.src('app/html/*.html')
        .pipe(rigger())
        // .pipe(htmlMin({
        //     collapseWhitespace: true
        // }))
        .pipe(gulp.dest('dist'));
});

gulp.task('jslibs', () => {
    return gulp.src(jslibssrc)
        .pipe(rigger())
        .pipe(minifyJs())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('js:es6', () => {
    return gulp.src('app/js/main.js')
        // .pipe(minifyJs())
        .pipe(concat('scripts.js'))
        // .pipe(rename({
        //     suffix: '.min'
        // }))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('js:back', () => {
    return gulp.src('app/js/backend.js')
        .pipe(gulp.dest('dist/js'))
});

// gulp.task('json:minify', () => {
//     return gulp.src('app/js/**/*.json')
//         .pipe(jsonMinify())
//         .pipe(gulp.dest('dist/js'));
// });

// gulp.task('js:babel', () => {
//     return gulp.src('app/js/**/*.js')
//         // .pipe(minifyJs())
//         .pipe(concat('scripts.js'))
//         .pipe(babel({
//             presets: ['@babel/env']
//         }))
//         .pipe(rename({
//             suffix: '.es5'
//         }))
//         .pipe(gulp.dest('dist/js'))
// });

// gulp.task('js:polifill', () => {
//     return gulp.src('node_modules/@babel/polyfill/dist/polyfill.js')
//         .pipe(minifyJs())
//         .pipe(rename({
//             suffix: '.min'
//         }))
//         .pipe(gulp.dest('dist/js'))
// });

gulp.task('favicon', () => {
    return gulp.src('app/favicon/**/*.*')
    .pipe(gulp.dest('dist/'))
});

gulp.task('fonts', () => {
    return gulp.src('app/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts/'))
});

gulp.task('server', () => {
    return bs({
        server: {
            baseDir: 'dist'
        }
    })
});

gulp.task('html:watch', () => {
    return gulp.watch('app/**/*.html', gulp.series('html:build', (done) => {
        bs.reload();
        done()
    }))
});
gulp.task('csslibs:watch', () => {
    return gulp.watch('app/sass/**/*.css', gulp.series('csslibs', (done) => {
        bs.reload();
        done()
    }))
});
gulp.task('sass:watch', () => {
    return gulp.watch('app/sass/**/*.scss', gulp.series('sass', (done) => {
        bs.reload();
        done()
    }))
});
gulp.task('customcss:watch', () => {
    return gulp.watch('app/sass/custom.css', gulp.series('customcss', (done) => {
        bs.reload();
        done()
    }))
});
gulp.task('js:watch', () => {
    return gulp.watch('app/js/**/*.js', gulp.series('js:es6', 'js:back', (done) => {
        bs.reload();
        done()
    }))
});
// gulp.task('json:watch', () => {
//     return gulp.watch('app/js/**/*.json', gulp.series('json:minify', (done) => {
//         bs.reload();
//         done()
//     }))
// });


gulp.task('message', async function() {
 console.log("HTTP Server Started");
});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('html:build', 'sass', 'customcss', 'csslibs', 'image:build', 'fonts', 'favicon', 'info', 'jslibs', 'js:es6', 'js:back', 'message'),
    gulp.parallel('html:watch', 'sass:watch', 'customcss:watch', 'js:watch', 'server')
));