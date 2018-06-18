app = require(process.cwd() + "/topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("description : ", function() {

	it("The compiler should accept simple quoted text",
		function() { expect( app.parse_syntax(`
description: ' une description quelconque avec un mot clef description:'
`, 'test_descr'					).errors).toEqual([]) });

	it("The compiler should accept double quoted text",
		function() { expect( app.parse_syntax(`
description: " une description ' quelconque avec un mot clef name:" # un commentaire
`, 'test_descr'				).errors).toEqual([]) });

	it("The compiler should accept double quoted multiligne text",
		function() { expect( app.parse_syntax(`
description: " une description' quelconque 
                 avec un \"mot\" 
       clef comme description:" # un commentaire
`, 'test_descr'				).errors).toEqual([]) });
  
	it("The compiler should accept unquoted text",
		function() { expect( app.parse_syntax(`
description: une description \"quelconque\" 
`, 'test_descr'				).errors).toEqual([]) });

	it("The compiler should accept unquoted text including quotes",
		function() { expect( app.parse_syntax(`
description: une d'escription "quelconque" ind"ie 
`, 'test_descr'				).errors).toEqual([]) });

	it("The compiler should accept prefix unquoted strings",
		function() { expect( app.parse_syntax(`
description: | une d'escription "quelconque" ind"ie 

`, 'test_descr'				).errors).toEqual([]) });

  	it("The parser should accept indented multiline strings",
		function() { expect( app.parse_syntax(`
description: >+ je suis très 
	content'
		deded
`,'test_descr').errors).toEqual([]) });

  	it("The parser should accept complex multiline strings",
		function() { expect( app.parse_syntax(`
description:>- je suis très 
  content' "deff 123.4
        description:
	    - 23.456
	    -2.34
            'frijsd dzed z \dred
            'r'r é&ç
            
             sde fre'rfd 343
		deded
`,'test_descr').errors).toEqual([]) });

	
  	it("The parser should not accept bad indent in multiline strings",
		function() { expect( app.parse_syntax(`
description: >+ je suis très 
	content'
deded
`,'test_descr').errors[0].text).toContain("extraneous input 'deded'") });


  	it("The parser should not accept monoline example of the normative doc",
		function() { expect( app.parse_syntax(`
description: This is an example of a single line description (no folding).
`,'test_descr').errors).toEqual([]) });


  	it("The parser should not accept monoline example of the normative doc",
		function() { expect( app.parse_syntax(`
description: >
  This is an example of a multi-line description using YAML. It permits for line
  breaks for easier readability...
  
  
  if needed. However, (multiple) line breaks are folded into a single space
  character when processed into a single string value.
`,'test_descr').errors).toEqual([]) });

	

  }); 


});
