app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("metadata : ", function() {

	it("The compiler should accept simple metadata",
		function() { expect( app.parse(
`tosca_definition_version: tosca_simple_yaml_1_0 # de

metadata:
  template_author: Xavier Talon
  template_name:   Un joli nom
`					)).toEqual([]) });

	it("The compiler should accept metadata with additional keys",
		function() { expect( app.parse(
`tosca_definition_version: tosca_simple_yaml_1_0 # 

metadata:
  celui_la: la
  template_author: Xavier Talon
  template_name:   Un joli nom
  autre: un autre
`				)).toEqual([]) });

	it("The compiler should reject metadata with duplicated keys",
		function() { expect( app.parse(
`tosca_definition_version: tosca_simple_yaml_1_0 # 

metadata:
  template_author: Xavier Talon
  template_name:   Un joli nom
  template_author: Jean Talon LU
`				)[0].text ).toContain("duplicated") });

  });

});
