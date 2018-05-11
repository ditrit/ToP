const antlr4 = require("antlr4/index")
const fs = require("fs")
const ToscaLexer = require("./ToscaLexer.js")
const ToscaParser = require("./ToscaParser.js")
const ToscaAstBuilder = require("./ToscaAstBuilder.js").ToscaAstBuilder
const syntax=0
const phase={syntax: 0, ast: 1}

var _ = require('lodash');

var exports=module.exports={};

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
