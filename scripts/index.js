'use strict';

const fs = require('fs');
const ts = require('typescript');

require.extensions['.ts'] = function(m, filename) {
  const source = fs.readFileSync(filename).toString();

  try {
    const result = ts.transpile(source, {
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.CommonJs
    });

    return m._compile(result, filename);
  } catch (err) {
    throw err;
  }
};

require('./cmd');
