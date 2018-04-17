app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("topology_template possibly empty : ", function() {

  	it("The compiler should accept empty 'topology_template' ",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

`	)).toEqual([]) });

  	it("The compiler should accept topology_template with empty 'description' section",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  description : 

`	)).toEqual([]) });

  	it("The compiler should accept topology_template with empty 'inputs' section",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  
  inputs:

`	)).toEqual([]) });

  	it("The compiler should accept topology_template with empty 'outputs' section",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  
  outputs:

`	)).toEqual([]) });

  	it("The compiler should accept topology_template with empty 'relationship_templates' section",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  
  relationship_templates:

`	)).toEqual([]) });

  	it("The compiler should accept topology_template with empty 'groups' section",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  
  groups:

`	)).toEqual([]) });

  	it("The compiler should accept topology_template with empty 'policies' section",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  
  policies:

`	)).toEqual([]) });

  	it("The compiler should accept topology_template with empty 'substitution_mapping' section",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  
  policies:

`	)).toEqual([]) });

  	it("The compiler should accept topology_template with empty 'workflows' section",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  
  workflows:

`	)).toEqual([]) });


  });

});
