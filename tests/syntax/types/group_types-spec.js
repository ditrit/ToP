app = require(process.cwd() + "/topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("group types : ", function() {

	it("The compiler should accept an empty group_types section",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

group_types:
` ).errors).toEqual([]) });

	it("The compiler should accept example of the normative doc",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

group_types:

  mycompany.mytypes.groups.placement:
    description: "My company's group type for placing nodes of type Compute"
    members: [ tosca.nodes.Compute ]

` ).errors).toEqual([]) });

	it("The compiler should accept members with NEWLINES",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

group_types:

  placement:
    description: My company's group type for placing nodes of type Compute
    members: [ 
      tosca.nodes.Compute 
    ]

` ).errors).toEqual([]) });

	it("The compiler should accept members in yaml extended notation",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

group_types:

  mycompany.mytypes.groups.placement:
    description: My company's group type for placing nodes of type Compute
    members: 
      - tosca.nodes.Compute

` ).errors).toEqual([]) });

	it("The compiler should accept example 'Example' p152 of the norm. doc",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

group_types:

  mycompany.mytypes.myScalingGroup:
    derived_from: tosca.groups.Root
` ).errors).toEqual([]) });

  });

});