const antlr4 = require("antlr4/index")
const fs = require("fs")
const ToscaLexer = require("./ToscaLexer.js")
const ToscaParser = require("./ToscaParser.js")
const ToscaListener = require("./ToscaListener.js").ToscaListener

var exports=module.exports={};

// class for gathering errors 
var AnnotatingErrorListener = function(annotations) {
    antlr4.error.ErrorListener.call(this);
    this.annotations = annotations;
    return this;
};

AnnotatingErrorListener.prototype = Object.create(antlr4.error.ErrorListener.prototype);
AnnotatingErrorListener.prototype.constructor = AnnotatingErrorListener;

AnnotatingErrorListener.prototype.syntaxError = function(recognizer, offendingSymbol, line, column, msg, e) {
    this.annotations.push({
        row: line - 1,
        column: column,
        text: msg,
        type: "error"
 });
};

function parse_file(filename, rule_name='tosca_input') {
  let input = fs.readFileSync(filename, 'UTF-8');
  return parse(input, rule_name);
}

function parse(input, rule_name='tosca_input') {
  var chars = new antlr4.InputStream(input);
  var lexer = new ToscaLexer.ToscaLexer(chars);
  var tokens  = new antlr4.CommonTokenStream(lexer);
  var parser = new ToscaParser.ToscaParser(tokens);
  parser.buildParseTrees = true;
  
  var annotations = [];
  var listener = new AnnotatingErrorListener(annotations);
  parser.removeErrorListeners();
  parser.addErrorListener(listener);
  
  var tree = parser[rule_name]();
  
  return annotations;
};


exports.parse=parse
exports.parse_file=parse_file
