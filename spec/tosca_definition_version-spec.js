app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("tosca_definitions_version : ", function() {

  	it("The compiler should accept correct value",
		function() { expect( app.parse(
`tosca_definitions_version: tosca_simple_yaml_1_2	
`					)).toEqual([]) });

  	it("The compiler should accept correct uri value",
		function() { expect( app.parse(
`tosca_definitions_version: http://docs.oasis-open.org/tosca/ns/simple/yaml/1.2	
`					)).toEqual([]) });

  	it("The compiler should accept incorrect uri value",
		function() { expect( app.parse(
`tosca_definitions_version: http://docs.oasis-open.org/tosca/ns/simple/yaml/1.1	
`					)[0].text).toContain("failed predicate") });

	
	it("The compiler should not accept bad value",
		function() { expect( app.parse(
`tosca_definitions_version: tosca_simple_yaml_21_0	
`					)[0].text).toContain("failed predicate") });
  });

});
