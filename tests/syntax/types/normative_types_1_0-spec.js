app = require(process.cwd() + "/topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("normative_types 1.0 : ", function() {

  	it("main imports",
		function() { expect( app.parse_file_syntax( "normative_types/tosca_simple_yaml_1_0/tosca_types.yaml" ).errors).toEqual([]) });

  	it("artifacts imports",
		function() { expect( app.parse_file_syntax( "normative_types/tosca_simple_yaml_1_0/artifacts.yaml" ).errors).toEqual([]) });

  	it("datatypes imports",
		function() { expect( app.parse_file_syntax( "normative_types/tosca_simple_yaml_1_0/datatypes.yaml" ).errors).toEqual([]) });

  	it("capabilities imports",
		function() { expect( app.parse_file_syntax( "normative_types/tosca_simple_yaml_1_0/capabilities.yaml" ).errors).toEqual([]) });

  	it("interfaces imports",
		function() { expect( app.parse_file_syntax( "normative_types/tosca_simple_yaml_1_0/interfaces.yaml" ).errors).toEqual([]) });

  	it("nodes imports",
		function() { expect( app.parse_file_syntax( "normative_types/tosca_simple_yaml_1_0/nodes.yaml" ).errors).toEqual([]) });

  	it("relationships imports",
		function() { expect( app.parse_file_syntax( "normative_types/tosca_simple_yaml_1_0/relationships.yaml" ).errors).toEqual([]) });

  	it("groups imports",
		function() { expect( app.parse_file_syntax( "normative_types/tosca_simple_yaml_1_0/groups.yaml" ).errors).toEqual([]) });

  	it("policies imports",
		function() { expect( app.parse_file_syntax( "normative_types/tosca_simple_yaml_1_0/policies.yaml" ).errors).toEqual([]) });

  });

});
