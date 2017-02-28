'use strict';

var livereload = require('livereload');
var path = require('path');

var opts = { consoleLogMsg: true };

function livereload$1 (options) {
  if ( options === void 0 ) options = { watch: '' };

  if (typeof options === 'string') {
    options = Object.assign(opts, { watch: options });
  }

  var port = options.port || 35729;
  var server = livereload.createServer(options);
  server.watch(path.resolve(process.cwd(), options.watch));

  opts = Object.assign(opts, options);

  return {
    name: 'livereload',
    banner: ("document.write('<script src=\"http" + (options.https?'s':'') + "://' + (location.host || 'localhost').split(':')[0] + ':" + port + "/livereload.js?snipver=1\"></' + 'script>');"),
    ongenerate: function ongenerate () {
      if (opts.consoleLogMsg) {
        console.log(green('LiveReload enabled'));
      }
    }
  }
}

function green (text) {
  return '\u001b[1m\u001b[32m' + text + '\u001b[39m\u001b[22m'
}

module.exports = livereload$1;
