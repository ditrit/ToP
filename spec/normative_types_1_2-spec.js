app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("normative_types 1.2 : ", function() {

  	it("main imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_2/tosca_types.yaml" )).toEqual([]) });

  	it("artifacts imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_2/artifacts.yaml" )).toEqual([]) });

  	it("datatypes imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_2/datatypes.yaml" )).toEqual([]) });

  	it("capabilities imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_2/capabilities.yaml" )).toEqual([]) });

  	it("interfaces imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_2/interfaces.yaml" )).toEqual([]) });

  	it("nodes imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_2/nodes.yaml" )).toEqual([]) });

  	it("relationships imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_2/relationships.yaml" )).toEqual([]) });

  	it("groups imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_2/groups.yaml" )).toEqual([]) });

  	it("policies imports",
		function() { expect( app.parse_file( "normative_types/tosca_simple_yaml_1_2/policies.yaml" )).toEqual([]) });

  });

});
