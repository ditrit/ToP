app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("normative_types 1.0 : ", function() {

  	it("main imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_0.yaml" )).toEqual([]) });

  	it("artifacts imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_0_artifacts.yaml" )).toEqual([]) });

  	it("datatypes imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_0_datatypes.yaml" )).toEqual([]) });

  	it("capabilities imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_0_capabilities.yaml" )).toEqual([]) });

  	it("interfaces imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_0_interfaces.yaml" )).toEqual([]) });

  	it("nodes imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_0_nodes.yaml" )).toEqual([]) });

  	it("relationships imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_0_relationships.yaml" )).toEqual([]) });

  	it("groups imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_0_groups.yaml" )).toEqual([]) });

  	it("policies imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_0_policies.yaml" )).toEqual([]) });

  });

});
