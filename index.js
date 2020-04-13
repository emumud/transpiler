const fs = require('fs');

const debugLogRegex = /\B#D\((.*)\)/g;

const version = require('./package.json').version;

function transpileFile(filepath) {
  const origContent = fs.readFileSync(filepath);

  return transpileScript(origContent);
}

function transpileScript(origContent) {
  const conversionKeys = [
    debugLogRegex,
    /(#[fhmln0-4]s)\.([a-z][0-z]{0,24}\.[0-z]*)\(\)/g,
    /(#[fhmln0-4]s)\.([a-z][0-z]{0,24}\.[0-z]*)\((.*)\)/g,
  ];

  const conversionValues = [
    'logging.log($1)',
    'transpiler.runScriptName(\'$2\', emumud_context, undefined)',
    'transpiler.runScriptName(\'$2\', emumud_context, $3)',
  ];

  let content = `'use strict'; // transpiled with emumud transpiler v${version}\n${origContent}`;

  let contextName = 'undefined';
  let argsName = 'undefined';

  content = content.replace(/^ *(function *)(\()([a-z]*)?(, *)?([a-z]*)?(\) *{.*)/gm, (_, fun, brack, context, comma, args, end) => {
    contextName = context || 'undefined';
    argsName = args || 'undefined';

    return `function run(${context || ''}${comma || ''}${args || ''}${end} // eslint-disable-line no-unused-vars`;
  });

  for (let i = 0; i < conversionValues.length; i++) {
    content = content.replace(conversionKeys[i], conversionValues[i].replace('CONTEXT_ARG', contextName).replace('ARGS_ARG', argsName));
  }

  content += '\nrun(emumud_context, emumud_args);';

  return content;
}

function hasDebugLogs(originalContent) {
  return debugLogRegex.test(originalContent);
}

module.exports = {
  transpileFile,
  transpileScript,

  hasDebugLogs
};