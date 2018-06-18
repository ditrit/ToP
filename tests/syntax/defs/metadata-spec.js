app = require(process.cwd() + "/topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("metadata : ", function() {

	it("The compiler should accept empty metadata section",
		function() { expect( app.parse_syntax(
`tosca_definitions_version: tosca_simple_yaml_1_2 # de
metadata:
` ).errors).toEqual([]) });

	it("The compiler should accept simple metadata",
		function() { expect( app.parse_syntax(
`tosca_definitions_version: tosca_simple_yaml_1_2 # de

metadata:
  template_author: Xavier Talon
  template_name:   Un joli nom
` ).errors).toEqual([]) });

	it("The compiler should accept metadata with additional keys",
		function() { expect( app.parse_syntax(
`tosca_definitions_version: tosca_simple_yaml_1_2 # 

metadata:
  celui_la: la
  template_author: Xavier Talon
  template_name:   Un joli nom
  autre: un autre
` ).errors).toEqual([]) });

	it("The compiler should reject metadata with duplicated keys",
		function() { expect( app.parse_syntax(
`tosca_definitions_version: tosca_simple_yaml_1_2 # 

metadata:
  template_author: Xavier Talon
  template_name:   Un joli nom
  template_author: Jean Talon LU
` ).errors[0].text ).toContain("duplicated") });

	it("The compiler should accept example of the normative doc",
		function() { expect( app.parse_syntax(
`tosca_definitions_version: tosca_simple_yaml_1_2 # 

metadata:
  foo1: bar1
  foo2: bar2
` ).errors).toEqual([]) });
	
  });

});
