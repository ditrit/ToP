app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("values : ", function() {


    describe("short_str : ", function() {

  	it("The parser should accept simple quoted strings",
		function() { expect( app.parse(`
'je suis: très "content !"'
`, 'test_short_str')).toEqual([]) });
    
  	it("The parser should accept double quoted strings",
		function() { expect( app.parse(`
"je suis très: 'content'"
`, 'test_short_str')).toEqual([]) });
    
  	it("The parser should accept no quoted strings",
		function() { expect( app.parse(`
je suis très 'content'
`, 'test_short_str')).toEqual([]) });
    
  	it("The parser should accept @ip",
		function() { expect( app.parse(`
9.9.89.89
`, 'test_short_str')).toEqual([]) });
    
		
	});   

	
  });
  
});
