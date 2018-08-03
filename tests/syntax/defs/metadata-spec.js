basedir=process.cwd()

classes = require(basedir + '/ToscaTypes.js').classes
app = require(basedir + '/topar.js');

describe("Tosca Compiler syntax -> ", function() {
	
  describe("metadata : ", function() {


	it("The compiler should accept simple metadata",
		function() { expect( app.parse_string(
`
  template_author: Xavier Talon
  template_name:   Un joli nom
`, 'metadata' ) instanceof classes.ToscaMetadata ).toEqual(true) });

	it("The compiler should accept metadata with additional keys",
		function() { expect( app.parse_string(
`
  celui_la: la
  template_author: Xavier Talon
  template_name:   Un joli nom
  autre: un autre
`, 'metadata'  ) instanceof classes.ToscaMetadata).toEqual(true) });


	it("The compiler should reject metadata with duplicated keys",
		function() { expect( app.parse_string(
`
  template_author: Xavier Talon
  template_name:   Un joli nom
  template_author: Jean Talon LU
`, 'metadata'  ) instanceof classes.ToscaMetadata).toEqual(false) });


	it("The compiler should accept example of the normative doc",
		function() { expect( app.parse_string(
`
  foo1: bar1
  foo2: bar2
`, 'metadata'  ) instanceof classes.ToscaMetadata).toEqual(true) });
	
  it("The compiler should not accept additional keys with numerical values",
    function() { expect( app.parse_string(
`
  foo1: bar1
  foo2: 12
`, 'metadata'  ) instanceof classes.ToscaMetadata).toEqual(false) });
  
  });

});
