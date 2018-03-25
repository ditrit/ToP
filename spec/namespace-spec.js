app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("namespace : ", function() {

  	it("The compiler should accept correct value",
		function() { expect( app.parse(
`namespace: https://toscar.simplet.yaml.fr/1.2/
`, 'test'	)).toEqual([]) });

  	it("The compiler should accept correct uri with @IP",
		function() { expect( app.parse(
`namespace: http://232.34.123.0/tosca/ns/simple/yaml/1.2	
`, 'test'	)).toEqual([]) });

	
	it("The compiler should not accept malformed uri",
		function() { expect( app.parse(
`namespace: http://plou.plif..d/ftg
`, 'test'	)[0].text).toContain("extraneous input '.'") });
  });

});
