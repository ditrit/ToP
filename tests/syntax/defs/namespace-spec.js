app = require(process.cwd() + "/topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("namespace : ", function() {

  	it("The compiler should accept correct value",
		function() { expect( app.parse_syntax(
`namespace: https://toscar.simplet.yaml.fr/1.2/
`, 'test_namespace'	).errors).toEqual([]) });

  	it("The compiler should accept correct uri with @IP",
		function() { expect( app.parse_syntax(
`namespace: http://232.34.123.0/tosca/ns/sim.ple/yaml/1.2	
`, 'test_namespace'	).errors).toEqual([]) });

	
	it("The compiler should not accept malformed uri",
		function() { expect( app.parse_syntax(
`namespace: http://plou.plif..d/ftg
`, 'test_namespace'	).errors[0].text).toContain("mismatched input '..'") });
  });

});
