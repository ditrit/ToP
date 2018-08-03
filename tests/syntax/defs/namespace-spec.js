basedir=process.cwd()

classes = require(basedir + '/ToscaTypes.js').classes
app = require(basedir + '/topar.js');

describe("Tosca Compiler syntax -> ", function() {
	
  describe("namespace : ", function() {

  	it("The compiler should accept correct value",
		function() { expect( app.parse_string(
`https://toscar.simplet.yaml.fr/1.2
`, 'namespace'	) instanceof classes.ToscaURL).toEqual(true) });

  	it("The compiler should accept correct uri with @IP",
		function() { expect( app.parse_string(
`http://232.34.123.0/tosca/ns/sim.ple/yaml/1.2
`, 'namespace'	) instanceof classes.ToscaURL).toEqual(true) });

	it("The compiler should not accept malformed uri",
		function() { expect( app.parse_string(
`http://plou.plif..d/ftg
`, 'namespace'	) instanceof classes.ToscaURL).toEqual(false) });
  });

});
