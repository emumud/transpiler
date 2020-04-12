const fs = require('fs');

const debugLogRegex = /\B#D\((.*)\)/g;

const version = require('package.json').version;

async function transpileFile(filepath, quiet = false) {
  const origContent = await fs.promises.readFile(filepath);

  return transpileScript(origContent, quiet);
}

function transpileScript(origContent, quiet = false) {
  let log = quiet ? function() {} : process.stdout.write;

  log('Preparing');

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

  log('\rInterpreting');

  let content = `'use strict'; // transpiled with emumud transpiler v${version}\n${origContent}`;

  let contextName = 'undefined';
  let argsName = 'undefined';

  content = content.replace(/^ *(function *)(\()([a-z]*)?(, *)?([a-z]*)?(\) *{.*)/gm, (_, fun, brack, context, comma, args, end) => {
    contextName = context || 'undefined';
    argsName = args || 'undefined';

    return `function run(${context || ''}${comma || ''}${args || ''}${end} // eslint-disable-line no-unused-vars`;
  });

  log('\rTranspiling');

  for (let i = 0; i < conversionValues.length; i++) {
    content = content.replace(conversionKeys[i], conversionValues[i].replace('CONTEXT_ARG', contextName).replace('ARGS_ARG', argsName));
  }

  log('\rFinalising');

  content += '\nrun(emumud_context, emumud_args);';

  log('\rComplete\n');

  return {
    transpiled: content,
    original: origContent,
  };
}

function hasDebugLogs(originalContent) {
  return debugLogRegex.test(originalContent);
}

module.exports = {
  transpileFile,
  transpileScript,

  hasDebugLogs
};