app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("policy types : ", function() {

	it("The compiler should accept an empty policy_types section",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

policy_types:
` )).toEqual([]) });

	it("The compiler should accept example of the normative doc",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

policy_types:

  mycompany.mytypes.policies.placement.Container.Linux:
    description: My company’s placement policy for linux
    derived_from: tosca.policies.Root
` )).toEqual([]) });

	it("The compiler should accept example 'Example' p152 of the normative doc",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

policy_types:

  mycompany.mytypes.myScalingPolicy:
    derived_from: tosca.policies.Scaling
` )).toEqual([]) });


  });

});