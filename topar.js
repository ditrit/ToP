const fs = require("fs")
const yaml = require('yaml-js')
const pointer = require('json-pointer');
const ToscaSchemas = require("./ToscaSchema.js");
const ToscaTypes = require("./ToscaTypes.js")

const tosca_definitions = 'tosca_definitions';  

//var _ = require('lodash');

exports=module.exports={};

function load_schemas() {
  let schemas = {}
  let factory = {}
  versions = fs.readdirSync(tosca_definitions);
  for (let version of versions) {
      schemas[version] = {};
      factory[version] = {};
      const schema_dir = `${tosca_definitions}/${version}/definitions`;
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
              schemas[version][name] = ToscaSchemas.ajv.compile(schema[name].schema);
              factory[version][name] = schema[name].factory;
            };
          } catch(e) {
              console.error(e);
          }
        }
      } 
  }
  return [ schemas, factory ];
}

const [ _schemas, _factory ] = load_schemas();


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


function getAstVal(data, jsonPath) {
  //path = jsonPath.split("/").map(x => x.length>0 ? `/${x}/val`: "/val").join("")
  if (jsonPath == "/" || jsonPath == "") {
    return data
  } else {
    let parts = jsonPath.split("/")
    let path = "/val"
    if (parts.length > 1) {
      for (var i = 1, len = parts.length - 1; i < len; i++) {
        path += `/${parts[i]}/val`
      }
      path += `/${parts[i]}`
    }
    return (pointer.has(data, path)) ? pointer.get(data, path) : null
  }
}

function getFromPath(input, path) {
  if (!input) { return null }
  let data = [ { data: input, keys: {} } ]
  if (!path || path == "/" || path =="") { 
    return data 
  }
  let parts = path.split("/")
  for (var i=1, len = parts.length; i < len; i++) {
    data = data.map( x => ("val" in x.data) ? { data: x.data.val, keys: x.keys } : "error")
    if ("error" in data) { return null}  
    let part = parts[i]
    if (part.startsWith('@')) {
      let newdata = []
      data.forEach(function(x) {
        for (ele in x.data) {
          let newkeys = {}
          for (k in x.keys) { newkeys[k] = x.keys[k] }
          newkeys[part] = ele
          newdata.push({ data: x.data[ele], keys: newkeys })
        }
      })
      data = newdata
    } else {
      data = data.map(x => (part in x.data) ? { data: x.data[part], keys: x.keys } : "error")
      if ("error" in data) { return null} 
    }
  }

  return data
}

function toscaAstPath(input, pathDef, tosca_version) {
  let type    = pathDef.type
  let path    = pathDef.path
  let ref     = pathDef.$ref
  let isin    = pathDef.isin
  let isnotin = pathDef.isnotin

  if (path == "/description") debugger
  let dataPath = getFromPath(input, path)
  let data = (dataPath) ? dataPath[0].data : dataPath
  if (ref) {
    data = toscaAstFactory(data, _factory[tosca_version][ref], tosca_version)
  } 

  let res
  if (type && type != 'ref') {
    res = new ToscaTypes.DynamicClass((!data) ? "ToscaNull" : type, { value: data }, input)
  } else {
    res = data
  }

  return res
}

function toscaAstArgs(input, argsDef, tosca_version) {
  let type = argsDef.type
  let args = argsDef.args

  let newArgs = {}
  for (let ele in args) {
    if (!ele.startsWith('@')) {
      newArgs[ele] = toscaAstFactory(input, args[ele], tosca_version)
    }
  }

  let res
  if (type) {
    res = new ToscaTypes.DynamicClass((!input) ? "ToscaNull" : type, newArgs, input)
  } else {
    res = data
  }
  return res
}

function toscaAstFactory(input, astDef, tosca_version) {
  let type = astDef.type
  if ("args" in astDef && "path" in astDef) throw Error("ast ToscaDefinition can not use 'args' and 'path' simultaneously")

  if ("args" in astDef) {
    return toscaAstArgs(input, astDef, tosca_version)
  } else if ("path" in astDef) {
    return toscaAstPath(input, astDef, tosca_version)
  } else {
      throw Error(`ast ToscaDefinition must use 'args' or 'path' : ${JSON.stringify(astDef, null, 2)}`)
  }
}

function buildToscaAst(ast, schema_name, version, filename) {
  let tosca_version = (version) ? version :   "tosca_simple_yaml_1_2"
  let factory_name  = (schema_name)  ? schema_name  : "service_template"
  let factory = _factory[tosca_version][factory_name]
  let ret = toscaAstFactory(ast, factory, tosca_version)
  return ret
}

function parse_file(filename, schema_name=null, version=null) {
  let input = fs.readFileSync(filename, 'UTF-8');
  return parse(input,  filename, schema_name, version);
}

function parse_string(input, schema_name=null, version=null) {
  let input = fs.readFileSync(filename, 'UTF-8');
  return parse(input, null, schema_name, version);
}

function parse(input, filename, schema_name, version) {
  let yamlAst   = buildYamlAst(input, filename);
  if ( validateToscaSyntax(yamlAst, schema_name, version, filename) ) {
    toscaAst = buildToscaAst(yamlAst, schema_name, version, filename)
    console.log(toscaAst)
  }

};

exports.parse_file=parse_file
exports.parse_string=parse_string
