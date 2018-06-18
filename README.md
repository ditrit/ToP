# ToP
ToP stands for *Tosca Parser* and aims to be a fully compliant Tosca OASIS normative parser 
(cf [TOSCA Simple Profile in YAML Version 1.2](http://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.2/TOSCA-Simple-Profile-YAML-v1.2.pdf)).
All features defined in the TOSCA 1.2 standard are implemented with the exception of *'dsl_definitions'*.

Currently, ToP is limited to syntax validation.
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

## Tests
Tests are implemented with *jasmine* and are located in the *spec* directory.
Normative types (1.0 and 1.2) come from the dedicated [normative_types](https://github.com/ditrit/normative_types) ditrit project.

The tests (a little over 400) cover the entire grammar as defined in the standard and all the examples provided in the latter.

## Caution
ToP is currently only a syntax validator and has not been tested in production. 
