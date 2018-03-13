const antlr4 = require("antlr4/index")
const fs = require("fs")
const ToscaLexer = require("./ToscaLexer.js")
const ToscaParser = require("./ToscaParser.js")
const ToscaListener = require("./ToscaListener.js").ToscaListener

var exports=module.exports={};

// class for gathering errors and posting them to ACE editor
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

function parse(filename) {
  var input = fs.readFileSync(filename, 'UTF-8')
  var chars = new antlr4.InputStream(input)
  var lexer = new ToscaLexer.ToscaLexer(chars)
  var tokens  = new antlr4.CommonTokenStream(lexer)
  var parser = new ToscaParser.ToscaParser(tokens)
  parser.buildParseTrees = true;
  
  var annotations = [];
  var listener = new AnnotatingErrorListener(annotations)
  parser.removeErrorListeners();
  parser.addErrorListener(listener);
  
  var tree = parser.file_input()
//  var extractor = new ToscaListener()
//  antlr4.tree.ParseTreeWalker.DEFAULT.walk(extractor, tree)
  
  return annotations;
};


exports.parse=parse