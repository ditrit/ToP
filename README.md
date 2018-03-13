# ToPar
ToPar stands for *Tosca Parser* and aims to be a fully compliant and up-to-date Tosca OASIS normative parser 
(cf [TOSCA Simple Profile in YAML Version 1.2](http://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.1/TOSCA-Simple-Profile-YAML-v1.2.pdf)).

Currently, ToPar features are limited to syntax validation.
It is based on an ANTLR 4 grammar. The parser is built using the JavaSCript target.

## Prerequisites
You need to install :
- [antlr4](http://www.antlr.org/)
- [node js](https://nodejs.org/en/) 

[jasmine for node.js](https://jasmine.github.io/2.0/node.html) is used to automate tests.

## Build and use the parser
1. Compile the grammar to produce the JavaScript parser :
<pre>antlr4 -Dlanguage=JavaScript Tosca.g4</pre>
2. Use the CLI to parse a tosca yaml file :
<pre>node cli.js service_template.yaml</pre>
3. Execute tests
<pre>jasmine</pre>

## Caution
This project is not production ready at all and has not been tested. The API may change at each commit.
