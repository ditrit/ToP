app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("tosca_definition_version : ", function() {

  	it("The compiler should accept correct value",
		function() { expect( app.parse(
`tosca_definition_version: tosca_simple_yaml_1_0	
`					)).toEqual([]) });
	
	it("The compiler should not accept bad value",
		function() { expect( app.parse(
`tosca_definition_version: tosca_simple_yaml_21_0	
`					)[0].text).toContain("mismatched input 'tosca_simple_yaml_21_0'") });
  });

});
