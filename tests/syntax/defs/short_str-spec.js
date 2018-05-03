app = require(process.cwd() + "/topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("values : ", function() {


    describe("short_str : ", function() {

  	it("The parser should accept simple quoted strings",
		function() { expect( app.parse_syntax(`
'je suis: très "content !"'
`, 'test_short_str').errors).toEqual([]) });
    
  	it("The parser should accept double quoted strings",
		function() { expect( app.parse_syntax(`
"je suis très: 'content'"
`, 'test_short_str').errors).toEqual([]) });
    
  	it("The parser should accept no quoted strings",
		function() { expect( app.parse_syntax(`
je suis très 'content'
`, 'test_short_str').errors).toEqual([]) });
    
  	it("The parser should accept @ip",
		function() { expect( app.parse_syntax(`
9.9.89.89
`, 'test_short_str').errors).toEqual([]) });
    
		
	});   

	
  });
  
});
