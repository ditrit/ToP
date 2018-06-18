app = require(process.cwd() + "/topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("policy types : ", function() {

	it("The compiler should accept an empty policy_types section",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

policy_types:
` ).errors).toEqual([]) });

	it("The compiler should accept example of the normative doc",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

policy_types:

  mycompany.mytypes.policies.placement.Container.Linux:
    description: My company’s placement policy for linux
    derived_from: tosca.policies.Root
` ).errors).toEqual([]) });

	it("The compiler should accept example 'Example' p152 of the normative doc",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

policy_types:

  mycompany.mytypes.myScalingPolicy:
    derived_from: tosca.policies.Scaling
` ).errors).toEqual([]) });


  });

});