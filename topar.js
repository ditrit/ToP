const fs = require("fs")
const yaml = require('yaml-js')
const pointer = require('json-pointer');
const ToscaSchemas = require("./ToscaSchema.js");

const tosca_definitions = 'tosca_definitions';  

//var _ = require('lodash');

exports=module.exports={};

function load_schemas() {
  let schemas = {}
  versions = fs.readdirSync(tosca_definitions);
  for (let version of versions) {
      schemas[version] = {};
      const schema_dir = `${tosca_definitions}/${version}/schemas`;
      let files;
      try {
        files = fs.readdirSync(schema_dir);
      } catch(e) {
        console.error(`Warning : No schemas found for '${version}'`);
        continue;
      }
      for (let schema_file of files) {
        if (schema_file.endsWith(".json")) {
          try {
            schema = JSON.parse(fs.readFileSync(`${schema_dir}/${schema_file}`, 'UTF-8'));
          } catch(e) {
              console.error(`Error: '${schema_dir}/${schema_file}' does not contain a valid JSON :`);
              console.error(e);
            return;
          }
          try {
            for (let name in schema) {
              schemas[version][name] = ToscaSchemas.ajv.compile(schema[name]);
            };
          } catch(e) {
              console.error(e);
          }
        }
      } 
  }
  return schemas;
}

const _schemas = load_schemas();


function adaptVals(ast) {
  if (ast instanceof yaml.nodes.MappingNode) {
    ast.val = {}
    for (let assoc of ast.value) {
      let [k,v] = assoc
      ast.val[k.value] = adaptVals(v)
    }
  } else if (ast instanceof yaml.nodes.SequenceNode) {
    ast.val = ast.value.map(x => adaptVals(x))
  } else ast.val = ast.value
  return ast
}


function buildYamlAst(input, filename) {
  let yamled
  try {
    yamled = yaml.compose(input);
  } catch(e) {
    let start =  (e.context_mark) ? `${e.context_mark.line + 1}:${e.context_mark.column + 1}` : ''
    let end =    (e.problem_mark) ? `${e.problem_mark.line + 1}:${e.problem_mark.column + 1}` : ''
    let buffer = (e.problem_mark) ? `${e.problem_mark.buffer}` : (e.context_mark) ? `${e.context_mark.buffer}` : ''
    let data = (e.context_mark && e.problem_mark) ? buffer.substring(e.context_mark.pointer, e.problem_mark.pointer) : buffer
    let errorMsg = `Yaml syntax error: ${e.context}, ${e.problem} (${filename}:${start}->${end} = "${data}")`  
    console.error(errorMsg)
    return false
  }
  let ast = adaptVals(yamled);
  return ast;
}

function validateToscaSyntax(ast, schema, version, filename) {
  let tosca_version = (version) ? version : "tosca_simple_yaml_1_2"
  let tosca_schema  = (schema)  ? schema  : "service_template"
  schema = _schemas[tosca_version][tosca_schema]
  valid = schema(ast)
  if (!valid) {
    for (let error of schema.errors) {
      let dpath  = error.dataPath;
      srcPath = (dpath.endsWith('/val')) ? dpath.substring(0,dpath.lastIndexOf('/')) : dpath
      let data = pointer.get(ast, srcPath)
      let start =  (data.start_mark) ? `${data.start_mark.line + 1}:${data.start_mark.column + 1}` : ''
      let end =    (data.end_mark) ? `${data.end_mark.line + 1}:${data.end_mark.column + 1}` : ''
      let buffer = (data.end_mark) ? `${data.end_mark.buffer}` : (data.start_mark) ? `${data.start_mark.buffer}` : ''
      let txt = (data.start_mark && data.end_mark) ? buffer.substring(data.start_mark.pointer, data.end_mark.pointer) : buffer
      dataTxt = (txt.length < 300) ? `"${txt}"` : `"${txt.trim().slice(0, 146)}  [ ... ] ${txt.trim().slice(-146)}"`
      let keywordMsg = error.message
      switch(error.keyword) {
        case "additionalProperties":
          keywordMsg = `${error.message}, keyword '${error.params.additionalProperty}' is not allowed`
          break;
        case "dictProperties":
          keywordMsg = `error in TOSCA definition`
          break;
        case "dictIdsDefinition":
          keywordMsg = `should be a map of well formed named TOSCA definitions`
          break;
      }
      let errorMsg = `\nTosca syntax error: ${keywordMsg}, \n  ${filename}:${start}->${end}, \n  ${dataTxt})`
      console.error(errorMsg)
    }
  }
  return valid
}

function parse_file(filename, schema=null, version=null) {
  let input = fs.readFileSync(filename, 'UTF-8');
  return parse(input,  filename, schema, version);
}

function parse_string(input, schema=null, version=null) {
  let input = fs.readFileSync(filename, 'UTF-8');
  return parse(input, null, schema, version);
}

function parse(input, filename, schema, version) {
  let ast   = buildYamlAst(input, filename);
  let valid = validateToscaSyntax(ast, schema, version, filename)
};

exports.parse_file=parse_file
exports.parse_string=parse_string
