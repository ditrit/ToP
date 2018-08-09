const fs = require("fs")
const yaml = require('yaml-js')
const pointer = require('json-pointer');
const ToscaSchemas = require("./ToscaSchema.js");
const ToscaTypes = require("./ToscaTypes.js")

const tosca_definitions = 'tosca_definitions';  

var _errors=[]

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
      if (k.value in ast.val) {
        _errors.push(`Syntax Error: duplicate '${k.value}' key`)
      } else {
        ast.val[k.value] = adaptVals(v)
      }
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
    _errors.push(errorMsg)
    return null
  }
  let ast = adaptVals(yamled);
  return (_errors.length) ? null : ast;
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
      _errors.push(errorMsg)
    }
  }
  return valid
}


function getFromPath(input, path, isin, isnotin) {
  if (!input) { return [] }
  let data = [ { data: input, keys: {} } ]
  if (!path || path == "/" || path =="") { 
    return data 
  }
  let parts = path.split("/")
  for (var i=1, len = parts.length; i < len; i++) {
    data = data.map( x => ("val" in x.data) ? { data: x.data.val, keys: x.keys } : "error")
    if (data.includes("error")) { return [] }   
    let part = parts[i]
    if (part.startsWith('@')) {
      let newdata = []
      data.forEach(function(x) {
        if (x.data instanceof Object && !(x.data instanceof Array)) { 
          for (let ele in x.data) {
            if ( (!isin || (ele.includes(isin)) ) && ( !isnotin || (!(ele.includes(isnotin))) ) ) { 
              let newkeys = {}
              for (k in x.keys) { newkeys[k] = x.keys[k] }
              newkeys[part] = ele
              newdata.push({ data: x.data[ele], keys: newkeys })
            }
          }
        } else newdata.push("error")
      })
      data = newdata
    } else {
      data = data.map(x => (x.data instanceof Object && !(x.data instanceof Array) && part in x.data) 
                           ? { data: x.data[part], keys: x.keys } : "error")
    }
    if (data.includes("error")) { return [] }
  }
  return data
}

function toscaFactoryRef(input, ref, tosca_version) {
  if (!ref) return null;
  return toscaFactory(input.data, _factory[tosca_version][ref], tosca_version)[0]
}

function toscaFactoryAnyOf(input, anyOf, tosca_version) {
  debugger
  if (!anyOf) return null;
  let found = false
  let data = null
  for (let i = 0; i < anyOf.length && !found; i++ ) {
    _errors = []
    data = toscaFactory(input.data, anyOf[i], tosca_version)
    found = ( _errors.length == 0 )
  }
  return { data: data[0].data, keys: input.keys }
}

function toscaFactoryItems(input, items, tosca_version) {
  debugger
  if (!items) return null;
  let data_list = []
  if (input.data.val instanceof Array) {
    for (let ele of input.data.val ) {
      let item = toscaFactory(ele, items, tosca_version)
      for (let item_ele of item) {
        data_list.push(item_ele.data)
      }
    }
    return { data: data_list, keys: {} }
  } else {
    _errors.push(`Syntax error: input should be a list (${input})`)
    return null
  }
}

function toscaFactoryArgs(input, args, tosca_version) {
  if (!args) return null;
  let newArgs = {}
  for (let ele in args) {
    let eleData = toscaFactory(input.data, args[ele], tosca_version)
    if (eleData.length == 0) {
      if (ele.indexOf('@') < 0) newArgs[ele] = null
      // handles simple ids
    } else if (ele.indexOf('@') < 0) {
      newArgs[ele] = eleData[0].data
      // handles generic ids
    } else {
      eleData.forEach(function(eleData_item) {
        let keys = eleData_item.keys
        let newEle = ele
        for (k in keys) { newEle = newEle.replace(k, keys[k]) }
        newArgs[newEle] = eleData_item.data
      })
    }
  }
  return { data: newArgs, keys: input.keys }
}

function toscaFactory(input, factory, tosca_version) {
  if (!factory) return []

  // 1. extract data from path ==> [ {val: ... , keys: ... } ]
  let data = getFromPath(input, factory.path, factory.isin, factory.isnotin)

  // 2. collect results for each data from path, 
  data = data.map(function(data_item) {
    return  toscaFactoryRef(   data_item, factory.ref,   tosca_version ) ||
            toscaFactoryAnyOf( data_item, factory.anyOf, tosca_version ) ||
            toscaFactoryArgs(  data_item, factory.args,  tosca_version ) || 
            toscaFactoryItems( data_item, factory.items, tosca_version ) || 
            data_item
  })

  // 3. Create ToscaObject
  let type = factory.type
  if (type) {
    if (type in ToscaTypes.classes) {
      if  (data.length == 0) _errors.push(`No data to instanciate ${type}`) 
      data = data.map(function(data_item) {
        try {
          return {  data: new ToscaTypes.DynamicClass(type, data_item, input),
                    keys: (data_item.keys) ? data_item.keys : {} }
        } catch (e) {
          _errors.push(`${e.name}: ${e.message}`)
          return { data: null, keys: {} }
        }
      })
    } else throw Error(`invalid type (${type}) in tosca factory definition`)
  }

  return data
}

function buildToscaAst(ast, schema_name, version, filename) {
  let tosca_version = (version) ? version :   "tosca_simple_yaml_1_2"
  let factory_name  = (schema_name)  ? schema_name  : "service_template"
  let factory = _factory[tosca_version][factory_name]
  let ret = toscaFactory(ast, factory, tosca_version)
  return ret
}

function parse_file(filename, schema_name=null, version=null) {
  let input = fs.readFileSync(filename, 'UTF-8');
  return parse(input,  filename, schema_name, version);
}

function parse_string(input, schema_name=null, version=null) {
  return parse(input, null, schema_name, version);
}

function parse(input, filename, schema_name, version) {
  _errors = []
  let yamlAst   = buildYamlAst(input, filename);
  if (yamlAst && validateToscaSyntax(yamlAst, schema_name, version, filename) ) {
    toscaAst = buildToscaAst(yamlAst, schema_name, version, filename)
    if ((toscaAst instanceof Array) && (toscaAst.length > 0) && ("data" in toscaAst[0])) {
      return toscaAst[0].data
    }
  }

//  return (_errors.length) ? _errors : (toscaAst) ? toscaAst[0].data : null
};

exports.parse_file=parse_file
exports.parse_string=parse_string
