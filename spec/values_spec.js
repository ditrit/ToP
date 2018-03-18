app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("Test values : ", function() {

    describe("version : ", function() {

  	it("The compiler should accept a major.minor version ",
		function() { expect( app.parse(`3.4`, 'version')).toEqual([]) });

  	it("The compiler should accept a major.minor.fix version",
		function() { expect( app.parse(`2.0.12`, 'version')).toEqual([]) }); 

  	it("The compiler should accept a major.minor.fix-qualifier version",
		function() { expect( app.parse(`3.1.0.beta`, 'version')).toEqual([]) }); 

	it("The compiler should accept a major.minor.fix-qualifier version",
		function() { expect( app.parse(`1.0.0.alpha-10`, 'version')).toEqual([]) });  
	
  	it("The compiler should not accept a version with no major",
		function() { expect( app.parse(`.4`, 'version')[0].text).toContain(
					 "mismatched input '.4'") }); 

    });

    describe("integer : ", function() {

  	it("The compiler should accept big integer ",
		function() { expect( app.parse(`123456789`, 'integer')).toEqual([]) });

  	it("The compiler should accept negative integer",
		function() { expect( app.parse(`-3241`, 'integer')).toEqual([]) }); 

  	it("The compiler should accept '0o' (base 8) integer",
		function() { expect( app.parse(`0o3412072`, 'integer')).toEqual([]) }); 

  	it("The compiler should accept '0O' (base 8) integer",
		function() { expect( app.parse(`-0O123412072`, 'integer')).toEqual([]) }); 

  	it("The compiler should accept '0x (base 16) integer",
		function() { expect( app.parse(`+0x3Fa4c1207B2`, 'integer')).toEqual([]) }); 

  	it("The compiler should accept 0X (base 16) as integer",
		function() { expect( app.parse(`0XD123AB`, 'integer')).toEqual([]) }); 

  	it("The compiler should accept '0b (base 16) integer",
		function() { expect( app.parse(`-0b111001`, 'integer')).toEqual([]) }); 

  	it("The compiler should accept 0B (base 16) as integer",
		function() { expect( app.parse(`0B1001`, 'integer')).toEqual([]) }); 

	it("The compiler should accept '+' as sign for integers",
		function() { expect( app.parse(`+12`, 'integer')).toEqual([]) }); 

	it("The compiler should accept infinity as integer",
		function() { expect( app.parse(`-.inf`, 'integer')).toEqual([]) });  
	
  	it("The compiler should accept NaN as integer ",
		function() { expect( app.parse(`.NaN`, 'integer')).toEqual([]) }); 

  	it("The compiler should not accept real as integer ",
		function() { expect( app.parse(`123.0`, 'integer')[0].text).toContain(
					 "mismatched input '123.0'") }); 

  	it("The compiler should not accept boolean as integer ",
		function() { expect( app.parse(`true`, 'integer')[0].text).toContain(
					 "mismatched input 'true'") }); 

  	it("The compiler should not accept null value as integer ",
		function() { expect( app.parse(`null`, 'integer')[0].text).toContain(
					 "mismatched input 'null'") }); 

    });    

    describe("real (float) : ", function() {

  	it("The compiler should accept a simple float (without exponent) ",
		function() { expect( app.parse(`3.4`, 'real')).toEqual([]) });

  	it("The compiler should accept a real with exponent",
		function() { expect( app.parse(`-.4e-4`, 'real')).toEqual([]) }); 

  	it("The compiler should accept 0 as real",
		function() { expect( app.parse(`0`, 'real')).toEqual([]) }); 

  	it("The compiler should accept integers as reals",
		function() { expect( app.parse(`-12`, 'real')).toEqual([]) }); 

	it("The compiler should accept infinity as real",
		function() { expect( app.parse(`-.inf`, 'real')).toEqual([]) });  
	
  	it("The compiler should accept NaN as real ",
		function() { expect( app.parse(`.NaN`, 'real')).toEqual([]) }); 

  	it("The compiler should not accept boolean as real ",
		function() { expect( app.parse(`true`, 'real')[0].text).toContain(
					 "mismatched input 'true'") }); 

  	it("The compiler should not accept null value as real ",
		function() { expect( app.parse(`null`, 'real')[0].text).toContain(
					 "mismatched input 'null'") }); 

    });

    describe("null : ", function() {

  	it("The compiler should accept a '~' as null value ",
		function() { expect( app.parse(`~`, 'null_value')).toEqual([]) });

  	it("The compiler should accept a 'null' as null value ",
		function() { expect( app.parse(`null`, 'null_value')).toEqual([]) });

  	it("The compiler should accept a 'NULL' as null value ",
		function() { expect( app.parse(`NULL`, 'null_value')).toEqual([]) });

  	it("The compiler should accept a 'Null' as null value ",
		function() { expect( app.parse(`Null`, 'null_value')).toEqual([]) });
	
	it("The compiler should not accept 0 as null value ",
		function() { expect( app.parse(`0`, 'null_value')[0].text).toContain(
					 "mismatched input '0'") }); 

  	it("The compiler should not accept nil as null value",
		function() { expect( app.parse(`nil`, 'null_value')[0].text).toContain(
					 "mismatched input 'nil'") }); 

  	it("The compiler should not accept empty as null value",
		function() { expect( app.parse(``, 'null_value')[0].text).toContain(
					 "missing NULL") }); 

    });

    describe("nan (not a number) : ", function() {

  	it("The compiler should accept '~' as NaN ",
		function() { expect( app.parse(`.nan`, 'nan')).toEqual([]) });

  	it("The compiler should accept 'null' as NaN ",
		function() { expect( app.parse(`.NaN`, 'nan')).toEqual([]) });

  	it("The compiler should accept 'NULL' as NaN ",
		function() { expect( app.parse(`.NAN`, 'nan')).toEqual([]) });

    });

    describe("infinity : ", function() {

  	it("The compiler should accept '.inf' as infinity ",
		function() { expect( app.parse(`.inf`, 'infinity')).toEqual([]) });

  	it("The compiler should accept '.Inf' as infinity ",
		function() { expect( app.parse(`.Inf`, 'infinity')).toEqual([]) });

  	it("The compiler should accept '.INF' as infinity ",
		function() { expect( app.parse(`.INF`, 'infinity')).toEqual([]) });

  	it("The compiler should accept '-.inf' as infinity ",
		function() { expect( app.parse(`-.inf`, 'infinity')).toEqual([]) });

  	it("The compiler should accept '-.Inf' as infinity ",
		function() { expect( app.parse(`-.Inf`, 'infinity')).toEqual([]) });

  	it("The compiler should accept '-.INF' as infinity ",
		function() { expect( app.parse(`-.INF`, 'infinity')).toEqual([]) });

  	it("The compiler should accept '+.inf' as infinity ",
		function() { expect( app.parse(`+.inf`, 'infinity')).toEqual([]) });

  	it("The compiler should accept '+.Inf' as infinity ",
		function() { expect( app.parse(`+.Inf`, 'infinity')).toEqual([]) });

  	it("The compiler should accept '+.INF' as infinity ",
		function() { expect( app.parse(`+.INF`, 'infinity')).toEqual([]) });

    });

    describe("bool (boolean) : ", function() {

  	it("The compiler should accept 'True' as bool value ",
		function() { expect( app.parse(`True`, 'bool')).toEqual([]) });

  	it("The compiler should accept 'TRUE' as bool value ",
		function() { expect( app.parse(`TRUE`, 'bool')).toEqual([]) });

  	it("The compiler should accept 'true' as bool value ",
		function() { expect( app.parse(`true`, 'bool')).toEqual([]) });

  	it("The compiler should accept 'False' as bool value ",
		function() { expect( app.parse(`False`, 'bool')).toEqual([]) });

  	it("The compiler should accept 'FALSE' as bool value ",
		function() { expect( app.parse(`FALSE`, 'bool')).toEqual([]) });

  	it("The compiler should accept 'true' as bool value ",
		function() { expect( app.parse(`false`, 'bool')).toEqual([]) });

  	it("The compiler should not accept '0' as bool value ",
		function() { expect( app.parse(`0`, 'bool')[0].text).toContain(
					 "mismatched input '0'") }); 

  	it("The compiler should not accept '1' as bool value ",
		function() { expect( app.parse(`1`, 'bool')[0].text).toContain(
					 "mismatched input '1'") }); 

  	it("The compiler should not accept 'T' as bool value ",
		function() { expect( app.parse(`T`, 'bool')[0].text).toContain(
					 "mismatched input 'T'") }); 

    });

    describe("timestamp : ", function() {

  	it("The compiler should accept '2016-04-04-15T00:00:00Z' as timestamp",
		function() { expect( app.parse(`2016-04-04-15T00:00:00Z`, 'timestamp')).toEqual([]) });

  	it("The compiler should accept '2016-04-08T21:59:43.10-06:00' as timestamp ",
		function() { expect( app.parse(`2016-04-08T21:59:43.10-06:00`, 'timestamp')).toEqual([]) });

  	it("The compiler should accept dates ",
		function() { expect( app.parse(`2002-12-14`, 'timestamp')).toEqual([]) });

  	it("The compiler should accept canonical form",
		function() { expect( app.parse(`2001-12-15T02:59:43.1Z`, 'timestamp')).toEqual([]) });

  	it("The compiler should accept valid iso8601 form ",
		function() { expect( app.parse(`2001-12-14t21:59:43.10-05:00`, 'timestamp')).toEqual([]) });

  	it("The compiler should accept space separated form ",
		function() { expect( app.parse(`2001-12-14 21:59:43.10 -5`, 'timestamp')).toEqual([]) });

  	it("The compiler should accept space separated with no time zone form ",
		function() { expect( app.parse(`2001-12-15 2:59:43.10`, 'timestamp')).toEqual([]) });

  	it("The compiler should not accept bad separators ",
		function() { expect( app.parse(`2002/12/14`, 'timestamp')[0].text).toContain(
					 "mismatched input '2002'") });

    });

    describe("strings : ", function() {

  	it("The compiler should accept simple quoted strings",
		function() { expect( app.parse(`'je suis très "content"'`, 'str')).toEqual([]) });
    
  	it("The compiler should accept double quoted strings",
		function() { expect( app.parse(`"je suis très 'content'"`, 'str')).toEqual([]) });
    
  	it("The compiler should accept no quoted strings",
		function() { expect( app.parse(`je suis très 'content'`, 'str')).toEqual([]) });
    
  	it("The compiler should accept multiline strings",
		function() { expect( app.parse(
`| je suis très 
  'content'
  en fait
`, 'str')).toEqual([]) });

  	it("The compiler should accept multiline strings with sub indentation",
		function() { expect( app.parse(
`| je suis très 
  'content'
     de tout
       cela
  en fait
`, 'str')).toEqual([]) });

  	it("The compiler should accept multiline strings with specifier",
		function() { expect( app.parse(
`>+ je suis très 
   'content'
     de tout
       cela
   en fait
`, 'str')).toEqual([]) });

  	it("The compiler should not accept bad indent in multiline strings",
		function() { expect( app.parse(
`>+ je suis très 
'content'
`,'str')[0].text).toContain("missing INDENT") });
	
	});
	
  });

});
