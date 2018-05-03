app = require(process.cwd() + "/topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("tosca_definitions_version : ", function() {

  	it("The compiler should accept correct value",
		function() { expect( app.parse_syntax(
`tosca_definitions_version: tosca_simple_yaml_1_2	
`, 'tosca_input'			).errors).toEqual([]) });

  	it("The compiler should accept correct uri value",
		function() { expect( app.parse_syntax(
`tosca_definitions_version: http://docs.oasis-open.org/tosca/ns/simple/yaml/1.2	
`, 'tosca_input'					).errors).toEqual([]) });

  	it("The compiler should not accept incorrect uri value",
		function() { expect( app.parse_syntax(
`tosca_definitions_version: http://docs.oasis-open.org/tosca/ns/simple/yaml/0.9	
`, 'tosca_input'					).errors[0].text).toContain("failed predicate") });

	
	it("The compiler should not accept bad value",
		function() { expect( app.parse_syntax(
`tosca_definitions_version: tosca_simple_yaml_21_0	
`, 'tosca_input'					).errors[0].text).toContain("failed predicate") });
  });

});
