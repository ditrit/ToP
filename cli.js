const antlr4 = require("antlr4/index")
const fs = require("fs")
const ToscaLexer = require("./ToscaLexer.js")
const ToscaParser = require("./ToscaParser.js")
const ToscaListener = require("./ToscaListener.js").ToscaListener

const iName = process.argv[2]
console.log("Compiling " + iName) 

var input = fs.readFileSync(iName, 'UTF-8')
var chars = new antlr4.InputStream(input)
var lexer = new ToscaLexer.ToscaLexer(chars)
var tokens  = new antlr4.CommonTokenStream(lexer)
var parser = new ToscaParser.ToscaParser(tokens)
parser.buildParseTrees = true
var tree = parser.file_input()

var extractor = new ToscaListener()
antlr4.tree.ParseTreeWalker.DEFAULT.walk(extractor, tree)

