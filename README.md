# ToPar
ToPar stands for *Tosca Parser* and aims to be a fully compliant and up-to-date Tosca OASIS normative parser.

Topar is based on ANTLR4. Currently, it is built using the JavaSCript target.

## Prerequisites
- antlr4
- node 
- jasmine (for tests)

## Build and use the parser
1. Compile the grammar to produce the JavaScript parser :
<pre>antlr4 -Dlanguage=JavaScript Tosca.g4</pre>
2. Use the CLI to parse a tosca yaml file :
<pre>node cli.js service_template.yaml</pre>
3. Execute tests
<pre>jasmine</pre>

## Caution
This project is not production ready at all and has not been tested. The API may change at each commit.
