# ToP
ToP stands for *Tosca Parser* and aims to be a fully compliant Tosca OASIS normative parser 
(cf [TOSCA Simple Profile in YAML Version 1.2](http://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.2/TOSCA-Simple-Profile-YAML-v1.2.pdf)).

Currently, ToP is limited to TOSCA syntax validation.
V0.3 is no more based on an ANTLR 4 grammar but uses yaml-js for Yaml parsing. 
Reason is yaml-js provides a similar AST structure as the one we defined for ToP V0.2 and is really more efficient...
V0.1 and V.02 ware based on an ANTLR 4 grammar.
- ToP V0.1 provides a fully TOSCA 1.2 grammar expressed in ANTLR V4. The counterpart is more than 150 keywords which can not be used as ids... and very low performance...
- ToP V0.2 splits TOSCA 1.2 grammar into two parts : a derivative YAML grammar expressed in ANTLR V4 and a TOSCA part expressed using json schemas. 
It makes the parser more (but not enough) efficient and allows to drastically reduce the number of keywords not to be used as ids.
Another provided feature is the ability to manage different TOSCA dialects (each one defined using json schemas).
- ToP V0.3 replaces ANTLR yaml parsing with Yaml-js providing good performances.

## Prerequisites
A recent version of [node js](https://nodejs.org/en/) 

Dependencies :
- Json schema validator [ajv](https://ajv.js.org)
  <pre>npm install ajv</pre>
- Ajv Extension to define cutom keywords [ajv-keywords](https://ajv.js.org/keywords.html)  
  <pre>npm install ajv-keywords</pre>
- Json pointer handling [json-pointer](https://www.npmjs.com/package/json-pointer)  
  <pre>npm install json-pointer</pre>
- Yaml parser [yaml-js](https://www.npmjs.com/package/yaml-js)
  <pre>npm install yaml-js</pre>
 

[jasmine for node.js](https://jasmine.github.io/2.0/node.html) is used to automate tests.

## Use the parser
<pre>
app = require('./topar.js');

# parse a tosca service_template file
let l1 = app.parse_file("tosca_definitions/tosca_simple_yaml_1_2/nodes.yaml")
</pre>

## Tests
Tests are implemented with *jasmine* and are located in the *tests* directory. 
Normative types (1.0 and 1.2) definitions come from the dedicated [normative_types](https://github.com/ditrit/normative_types) ditrit project.

## Caution
ToP is currently only a syntax validator and has not been tested in production. 
