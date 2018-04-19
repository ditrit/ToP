app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("normative_types 1.0 : ", function() {

  	it("main imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_0/tosca_types.yaml" )).toEqual([]) });

  	it("artifacts imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_0/artifacts.yaml" )).toEqual([]) });

  	it("datatypes imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_0/datatypes.yaml" )).toEqual([]) });

  	it("capabilities imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_0/capabilities.yaml" )).toEqual([]) });

  	it("interfaces imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_0/interfaces.yaml" )).toEqual([]) });

  	it("nodes imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_0/nodes.yaml" )).toEqual([]) });

  	it("relationships imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_0/relationships.yaml" )).toEqual([]) });

  	it("groups imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_0/groups.yaml" )).toEqual([]) });

  	it("policies imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_0/policies.yaml" )).toEqual([]) });

  });

});
