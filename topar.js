const antlr4 = require("antlr4/index")
const fs = require("fs")
const ToscaLexer = require("./ToscaLexer.js")
const ToscaParser = require("./ToscaParser.js")
const ToscaAstBuilder = require("./ToscaAstBuilder.js").ToscaAstBuilder
const ToscaSchemas = require("./ToscaSchema.js");
const pointer = require('json-pointer');


const syntax=0
const phase={syntax: 0, ast: 1}
const tosca_versions = require("./normative_types/versions.json");

//var _ = require('lodash');

exports=module.exports={};

ToscaErrors = function(annotations) {
  this.annotations = annotations;
}

ToscaErrors.prototype.constructor = ToscaErrors;

// class for gathering errors 
var AnnotatingErrorListener = function(annotations, filename) {
    antlr4.error.ErrorListener.call(this);
    this.annotations = annotations;
    this.filename

    return this;
};

AnnotatingErrorListener.prototype = Object.create(antlr4.error.ErrorListener.prototype);
AnnotatingErrorListener.prototype.constructor = AnnotatingErrorListener;

AnnotatingErrorListener.prototype.syntaxError = function(recognizer, offendingSymbol, line, column, msg, e) {
    this.annotations.push({
        filename: this.filename,
        row: line,
        column: column,
        text: msg,
        type: "error"
 });
};

function parse_file(filename, rule_name='tosca_input', step=phase.ast) {
  let input = fs.readFileSync(filename, 'UTF-8');
  return parse(input, rule_name, step, filename);
}

function load_schemas() {
  let schemas = {}
  const normative_types_dir= `normative_types`;  
  versions = [ ... new Set(Object.values(JSON.parse(fs.readFileSync(normative_types_dir + '/versions.json')))) ] 
  for (let version of versions) {
      schemas[version] = {};
      const schema_dir = `normative_types/${version}/schemas`;
      let files;
      try {
        files = fs.readdirSync(schema_dir);
      } catch(e) {
        console.error(`Le répertoire ${schema_dir} n'existe pas ou ne peut être ouvert`);
        return;
      }
      for (let schema_file of files) {
        try {
          schema = JSON.parse(fs.readFileSync(`${schema_dir}/${schema_file}`, 'UTF-8'));
        } catch(e) {
          console.error(`Le fichier ${schema_dir}/${schema_file} ne contient pas un schema valide :`);
          console.error(e);
          return;
        }
        try {
          for (let name in schema) {
            //console.log("schema name : " + name)
            schemas[version][name] = ToscaSchemas.ajv.compile(schema[name]);
          };
        } catch(e) {
          console.error(e)
        }
      } 
  }
  return schemas;
}

const _schemas = load_schemas();

AnnotatingErrorListener.prototype.syntaxError = function(recognizer, offendingSymbol, line, column, msg, e) {
    this.annotations.push({
        filename: this.filename,
        row: line,
        column: column,
        text: msg,
        type: "error"
 });
};

function simpleError(message, ast) {
  return { 
    filename: ast.ast_ctx.filename.split('/').pop(),
    message:  message,
    type:     "error"
  }
}

function getErrors(schema_errors, ast) {
  let annotations = [];
  for (let error of schema_errors) {
    let data = pointer.get(ast, error.dataPath)
    if (data && data.ast_ctx) {
      let txt = data.ast_ctx.rule_ctx.getText()
      let content = (txt.length < 80) ? `"${txt}"` : `"${txt.trim().slice(0, 38)}...${txt.trim().slice(-38)}"`
      annotations.push( {
        keyword:    error.keyword,
        schema:     JSON.stringify(error.schema),
        filename:   data.ast_ctx.filename.split('/').pop(),
        row:        data.ast_ctx.start_row,
        column:     data.ast_ctx.start_col,
        end_row:    data.ast_ctx.end_row,
        end_column: data.ast_ctx.end_col,
        type:       "error",
        content:    content 
      });
    }
  }
  return annotations;
}

function parse_files(filename) {
  ast = parse_file(filename);
  if (ast instanceof ToscaErrors) {
    console.log(ast.annotations)
    return ast;
  };
  if (ast instanceof Dict) {
    let annotations = {};
    tosca_version = ast.get("tosca_definitions_version");
    if (! tosca_version) {
      ast = new ToscaErrors(simpleError("Error : no tosca_definitions_version found", ast));
    } else {
      const sch = _schemas[tosca_version];
      let valid = sch.service_template(ast);
      if (!valid) {
        ast = new ToscaErrors(getErrors(sch.service_template.errors, ast));
      }
    };
  } else {
    ast = new ToscaErrors(simpleError("Error : this file does not seems to be a Tosca yaml", ast));
  };
  if (ast instanceof ToscaErrors) {
    console.log(ast.annotations)
  };
  return ast
}

function parse(input, rule_name='tosca_input', step=phase.ast, filename=null) {

  var chars = new antlr4.InputStream(input);
  var lexer = new ToscaLexer.ToscaLexer(chars);
  var tokens  = new antlr4.CommonTokenStream(lexer);
  var parser = new ToscaParser.ToscaParser(tokens);
  var ast = null;

  parser.buildParseTrees = true;
  
  var annotations = [];
  var listener = new AnnotatingErrorListener(annotations, filename);
  parser.removeErrorListeners();
  parser.addErrorListener(listener);
  
  if (step >= phase.syntax) {
    var tree = parser[rule_name]();
  }

  if (annotations.length > 0) {
      return new ToscaErrors(annotations);
  };
  
  if (step >= phase.ast) {
    var extractor = new ToscaAstBuilder(annotations, filename);
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(extractor, tree);
    ast = extractor.last;
  }

  if (annotations.length > 0) {
      return new ToscaErrors(annotations);
  } else {
      return ast;
  }
};

function parse_file_syntax(filename, rule_name='tosca_input') {
  return parse_file(filename, rule_name, phase.syntax)
}

function parse_syntax(input, rule_name='tosca_input', fiename=null) {
  return parse(input, rule_name, phase.syntax)
}

function parse_file_ast(filename, rule_name='tosca_input') {
  return parse_file(filename, rule_name, phase.ast)
}

function parse_ast(input, rule_name='tosca_input', filename=null) {
  return parse(input, rule_name, phase.ast)
}

exports.ToscaErrors=ToscaErrors
exports.parse_syntax=parse_syntax
exports.parse_file_syntax=parse_file_syntax
exports.parse_ast=parse_ast
exports.parse_file_ast=parse_file_ast
exports.parse=parse
exports.parse_file=parse_file
exports.parse_files= parse_files
exports.load_schemas = load_schemas