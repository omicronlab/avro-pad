import { Transform } from 'node:stream';
import { styleText } from 'node:util';
import gulp from 'gulp';
import del from 'del';
import lr from 'gulp-livereload';
import useref from 'gulp-useref';
import filter from 'gulp-filter';
import uglify from 'gulp-uglify';
import cleanCss from 'gulp-clean-css';
import rev from 'gulp-rev';
import revReplace from 'gulp-rev-replace';
import open from 'open';
import connect from 'connect';
import serveStatic from 'serve-static';

const { series, parallel, src, dest, watch } = gulp;

// Config Variables
const srcDir = 'src';
const buildDir = 'build';
const host = 'localhost';

// Vendor libraries pulled from node_modules into src/vendor, mirroring what
// Bower used to do. (Caret.js is committed directly, see src/vendor/Caret.js
// - upstream ships it with a `grunt` runtime dependency we don't want.)
const vendorFiles = [
  { src: 'node_modules/jquery/dist/jquery.js', dest: 'jquery/dist' },
  { src: 'node_modules/jquery.atwho/dist/js/jquery.atwho.js', dest: 'jquery.atwho/dist/js' },
  { src: 'node_modules/jquery.atwho/dist/css/jquery.atwho.css', dest: 'jquery.atwho/dist/css' },
  { src: 'node_modules/jquery-autosize/jquery.autosize.js', dest: 'jquery-autosize' },
  { src: 'node_modules/jquery-touchswipe/jquery.touchSwipe.js', dest: 'jquery-touchswipe' },
  { src: 'node_modules/device.js/lib/device.js', dest: 'device.js/lib' },
];

function filesize() {
  return new Transform({
    objectMode: true,
    transform(file, _enc, cb) {
      if (file.isBuffer()) {
        const kb = (file.contents.length / 1024).toFixed(2);
        console.log(styleText('cyan', file.relative) + ' ' + styleText('magenta', kb + ' kB'));
      }
      cb(null, file);
    },
  });
}

// Create a connect Server
function startServer(host, port, path, next) {
  connect()
    .use(serveStatic(path))
    .listen(port, next)
    .on('listening', function () {
      console.log(styleText('green', 'Started dev server on http://' + host + ':' + port));
      open('http://' + host + ':' + port);
    });
}

export function vendor() {
  return Promise.all(
    vendorFiles.map(
      (file) =>
        new Promise((resolve, reject) => {
          src(file.src)
            .pipe(dest(srcDir + '/vendor/' + file.dest))
            .on('end', resolve)
            .on('error', reject);
        })
    )
  );
}

function startDevServer(next) {
  startServer(host, process.env.DEVPORT || 8080, srcDir, next);
}
export const server = series(vendor, startDevServer);

export function clean() {
  return del(buildDir);
}

export function images() {
  return src(srcDir + '/images/**', { base: srcDir }).pipe(dest(buildDir));
}

export function assets() {
  const jsFilter = filter(['**/*.js'], { restore: true });
  const cssFilter = filter(['**/*.css'], { restore: true });

  return src(srcDir + '/*.html')
    .pipe(useref())
    .pipe(jsFilter)
    .pipe(uglify())
    .pipe(filesize())
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(cleanCss())
    .pipe(filesize())
    .pipe(cssFilter.restore)
    .pipe(rev())
    .pipe(revReplace())
    .pipe(dest(buildDir));
}

function watchTask(next) {
  lr.listen();
  watch(srcDir + '/**').on('change', (path) => {
    lr.changed(path);
  });
  next();
}

export const watch_ = series(server, watchTask);
export { watch_ as watch };

export const build = series(clean, vendor, parallel(images, assets));

export default series(
  build,
  function serve(next) {
    startServer(host, process.env.PORT || 8888, buildDir, next);
  }
);
