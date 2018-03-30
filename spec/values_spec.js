app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("Test values : ", function() {

    describe("version : ", function() {

  	it("The parser should accept a major.minor version ",
		function() { expect( app.parse(`3.4`, 'version')).toEqual([]) });

  	it("The parser should accept a major.minor.fix version",
		function() { expect( app.parse(`2.0.12`, 'version')).toEqual([]) }); 

  	it("The parser should accept a major.minor.fix-qualifier version",
		function() { expect( app.parse(`3.1.0.beta`, 'version')).toEqual([]) }); 

	it("The parser should accept a major.minor.fix-qualifier version",
		function() { expect( app.parse(`1.0.0.alpha-10`, 'version')).toEqual([]) });  
	
  	it("The parser should not accept a version with no major",
		function() { expect( app.parse(`.4`, 'version')[0].text).toContain(
					 "mismatched input '.4'") }); 

    });

    describe("integer : ", function() {

  	it("The parser should accept big integer ",
		function() { expect( app.parse(`123456789`, 'integer')).toEqual([]) });

  	it("The parser should accept negative integer",
		function() { expect( app.parse(`-3241`, 'integer')).toEqual([]) }); 

  	it("The parser should accept '0o' (base 8) integer",
		function() { expect( app.parse(`0o3412072`, 'integer')).toEqual([]) }); 

  	it("The parser should accept '0O' (base 8) integer",
		function() { expect( app.parse(`-0O123412072`, 'integer')).toEqual([]) }); 

  	it("The parser should accept '0x (base 16) integer",
		function() { expect( app.parse(`+0x3Fa4c1207B2`, 'integer')).toEqual([]) }); 

  	it("The parser should accept 0X (base 16) as integer",
		function() { expect( app.parse(`0XD123AB`, 'integer')).toEqual([]) }); 

  	it("The parser should accept '0b (base 16) integer",
		function() { expect( app.parse(`-0b111001`, 'integer')).toEqual([]) }); 

  	it("The parser should accept 0B (base 16) as integer",
		function() { expect( app.parse(`0B1001`, 'integer')).toEqual([]) }); 

	it("The parser should accept '+' as sign for integers",
		function() { expect( app.parse(`+12`, 'integer')).toEqual([]) }); 

	it("The parser should accept infinity as integer",
		function() { expect( app.parse(`-.inf`, 'integer')).toEqual([]) });  
	
  	it("The parser should accept NaN as integer ",
		function() { expect( app.parse(`.NaN`, 'integer')).toEqual([]) }); 

  	it("The parser should not accept real as integer ",
		function() { expect( app.parse(`123.0`, 'integer')[0].text).toContain(
					 "mismatched input '123.0'") }); 

  	it("The parser should not accept boolean as integer ",
		function() { expect( app.parse(`true`, 'integer')[0].text).toContain(
					 "mismatched input 'true'") }); 

  	it("The parser should not accept null value as integer ",
		function() { expect( app.parse(`null`, 'integer')[0].text).toContain(
					 "mismatched input 'null'") }); 

    });    

    describe("real (float) : ", function() {

  	it("The parser should accept a simple float (without exponent) ",
		function() { expect( app.parse(`3.4`, 'real')).toEqual([]) });

  	it("The parser should accept a real with exponent",
		function() { expect( app.parse(`-.4e-4`, 'real')).toEqual([]) }); 

  	it("The parser should accept 0 as real",
		function() { expect( app.parse(`0`, 'real')).toEqual([]) }); 

  	it("The parser should accept integers as reals",
		function() { expect( app.parse(`-12`, 'real')).toEqual([]) }); 

	it("The parser should accept infinity as real",
		function() { expect( app.parse(`-.inf`, 'real')).toEqual([]) });  
	
  	it("The parser should accept NaN as real ",
		function() { expect( app.parse(`.NaN`, 'real')).toEqual([]) }); 

  	it("The parser should not accept boolean as real ",
		function() { expect( app.parse(`true`, 'real')[0].text).toContain(
					 "mismatched input 'true'") }); 

  	it("The parser should not accept null value as real ",
		function() { expect( app.parse(`null`, 'real')[0].text).toContain(
					 "mismatched input 'null'") }); 

    });

    describe("null : ", function() {

  	it("The parser should accept a '~' as null value ",
		function() { expect( app.parse(`~`, 'null_value')).toEqual([]) });

  	it("The parser should accept a 'null' as null value ",
		function() { expect( app.parse(`null`, 'null_value')).toEqual([]) });

  	it("The parser should accept a 'NULL' as null value ",
		function() { expect( app.parse(`NULL`, 'null_value')).toEqual([]) });

  	it("The parser should accept a 'Null' as null value ",
		function() { expect( app.parse(`Null`, 'null_value')).toEqual([]) });
	
	it("The parser should not accept 0 as null value ",
		function() { expect( app.parse(`0`, 'null_value')[0].text).toContain(
					 "mismatched input '0'") }); 

  	it("The parser should not accept nil as null value",
		function() { expect( app.parse(`nil`, 'null_value')[0].text).toContain(
					 "mismatched input 'nil'") }); 

  	it("The parser should not accept empty as null value",
		function() { expect( app.parse(``, 'null_value')[0].text).toContain(
					 "missing NULL") }); 

    });

    describe("nan (not a number) : ", function() {

  	it("The parser should accept '~' as NaN ",
		function() { expect( app.parse(`.nan`, 'nan')).toEqual([]) });

  	it("The parser should accept 'null' as NaN ",
		function() { expect( app.parse(`.NaN`, 'nan')).toEqual([]) });

  	it("The parser should accept 'NULL' as NaN ",
		function() { expect( app.parse(`.NAN`, 'nan')).toEqual([]) });

    });

    describe("infinity : ", function() {

  	it("The parser should accept '.inf' as infinity ",
		function() { expect( app.parse(`.inf`, 'infinity')).toEqual([]) });

  	it("The parser should accept '.Inf' as infinity ",
		function() { expect( app.parse(`.Inf`, 'infinity')).toEqual([]) });

  	it("The parser should accept '.INF' as infinity ",
		function() { expect( app.parse(`.INF`, 'infinity')).toEqual([]) });

  	it("The parser should accept '-.inf' as infinity ",
		function() { expect( app.parse(`-.inf`, 'infinity')).toEqual([]) });

  	it("The parser should accept '-.Inf' as infinity ",
		function() { expect( app.parse(`-.Inf`, 'infinity')).toEqual([]) });

  	it("The parser should accept '-.INF' as infinity ",
		function() { expect( app.parse(`-.INF`, 'infinity')).toEqual([]) });

  	it("The parser should accept '+.inf' as infinity ",
		function() { expect( app.parse(`+.inf`, 'infinity')).toEqual([]) });

  	it("The parser should accept '+.Inf' as infinity ",
		function() { expect( app.parse(`+.Inf`, 'infinity')).toEqual([]) });

  	it("The parser should accept '+.INF' as infinity ",
		function() { expect( app.parse(`+.INF`, 'infinity')).toEqual([]) });

    });

    describe("bool (boolean) : ", function() {

  	it("The parser should accept 'True' as bool value ",
		function() { expect( app.parse(`True`, 'bool')).toEqual([]) });

  	it("The parser should accept 'TRUE' as bool value ",
		function() { expect( app.parse(`TRUE`, 'bool')).toEqual([]) });

  	it("The parser should accept 'true' as bool value ",
		function() { expect( app.parse(`true`, 'bool')).toEqual([]) });

  	it("The parser should accept 'False' as bool value ",
		function() { expect( app.parse(`False`, 'bool')).toEqual([]) });

  	it("The parser should accept 'FALSE' as bool value ",
		function() { expect( app.parse(`FALSE`, 'bool')).toEqual([]) });

  	it("The parser should accept 'true' as bool value ",
		function() { expect( app.parse(`false`, 'bool')).toEqual([]) });

  	it("The parser should not accept '0' as bool value ",
		function() { expect( app.parse(`0`, 'bool')[0].text).toContain(
					 "mismatched input '0'") }); 

  	it("The parser should not accept '1' as bool value ",
		function() { expect( app.parse(`1`, 'bool')[0].text).toContain(
					 "mismatched input '1'") }); 

  	it("The parser should not accept 'T' as bool value ",
		function() { expect( app.parse(`T`, 'bool')[0].text).toContain(
					 "mismatched input 'T'") }); 

    });

    describe("timestamp : ", function() {

  	it("The parser should accept '2016-04-04-15T00:00:00Z' as timestamp",
		function() { expect( app.parse(`2016-04-04-15T00:00:00Z`, 'timestamp')).toEqual([]) });

  	it("The parser should accept '2016-04-08T21:59:43.10-06:00' as timestamp ",
		function() { expect( app.parse(`2016-04-08T21:59:43.10-06:00`, 'timestamp')).toEqual([]) });

  	it("The parser should accept dates ",
		function() { expect( app.parse(`2002-12-14`, 'timestamp')).toEqual([]) });

  	it("The parser should accept canonical form",
		function() { expect( app.parse(`2001-12-15T02:59:43.1Z`, 'timestamp')).toEqual([]) });

  	it("The parser should accept valid iso8601 form ",
		function() { expect( app.parse(`2001-12-14t21:59:43.10-05:00`, 'timestamp')).toEqual([]) });

  	it("The parser should accept space separated form ",
		function() { expect( app.parse(`2001-12-14 21:59:43.10 -5`, 'timestamp')).toEqual([]) });

  	it("The parser should accept space separated with no time zone form ",
		function() { expect( app.parse(`2001-12-15 2:59:43.10`, 'timestamp')).toEqual([]) });

  	it("The parser should not accept bad separators ",
		function() { expect( app.parse(`2002/12/14`, 'timestamp')[0].text).toContain(
					 "mismatched input '2002'") });

    });

    describe("strings : ", function() {

  	it("The parser should accept simple quoted strings",
		function() { expect( app.parse(`'je suis très "content"'`, 'str')).toEqual([]) });
    
  	it("The parser should accept double quoted strings",
		function() { expect( app.parse(`"je suis très 'content'"`, 'str')).toEqual([]) });
    
  	it("The parser should accept no quoted strings",
		function() { expect( app.parse(`je suis très 'content'`, 'str')).toEqual([]) });
    
  	it("The parser should accept multiline strings",
		function() { expect( app.parse(
`| je suis très 
  'content'
  en fait
`, 'str')).toEqual([]) });

  	it("The parser should accept multiline strings with sub indentation",
		function() { expect( app.parse(
`| je suis très 
  'content'
     de tout
       cela
  en fait
`, 'str')).toEqual([]) });

  	it("The parser should accept multiline strings with specifier",
		function() { expect( app.parse(
`>+ je suis très 
   'content'
     de tout
       cela
   en fait
 
`, 'str')).toEqual([]) });
	
	});

    describe("scalar units : ", function() {

      describe("size ", function() {

  	  it("The parser should accept '10 GB' as size ",
		  function() { expect( app.parse(`-10 GB`, 'size')).toEqual([]) });

  	  it("The parser should accept be case insensitive ",
		  function() { expect( app.parse(`3.4 gIb`, 'size')).toEqual([]) });

  	  it("The parser should accept negative size ",
		  function() { expect( app.parse(`-4 KB`, 'size')).toEqual([]) });

  	  it("The parser should not accept bad unit ",
		  function() { expect( 
		  	app.parse(`-4 KiloBytes`, 
		  			  'size')[0].text).toContain("mismatched input") });

  	  it("The parser should not accept a none scalar value ",
		  function() { expect( 
		  	app.parse(`a KiB`, 
		  			  'size')[0].text).toContain("mismatched input") });
	  
	  });

      describe("time ", function() {

  	  it("The parser should accept '10 ms' as time ",
		  function() { expect( app.parse(`10 ms`, 'time')).toEqual([]) });

  	  it("The parser should accept be case insensitive ",
		  function() { expect( app.parse(`3.4 Ns`, 'time')).toEqual([]) });

  	  it("The parser should accept negative size ",
		  function() { expect( app.parse(`-4 H`, 'time')).toEqual([]) });

  	  it("The parser should not accept bad unit ",
		  function() { expect( 
		  	app.parse(`-4 plouf`, 
		  			  'time')[0].text).toContain("mismatched input") });

  	  it("The parser should not accept a none scalar value ",
		  function() { expect( 
		  	app.parse(`IV H`, 
		  			  'time')[0].text).toContain("mismatched input") });
	  
	  });

      describe("frequence ", function() {

  	  it("The parser should accept '10 ms' as freq ",
		  function() { expect( app.parse(`2.4 Ghz`, 'freq')).toEqual([]) });

  	  it("The parser should accept be case insensitive ",
		  function() { expect( app.parse(`3 gHz`, 'freq')).toEqual([]) });

  	  it("The parser should accept negative size ",
		  function() { expect( app.parse(`-4.34 HZ`, 'freq')).toEqual([]) });

  	  it("The parser should not accept bad unit ",
		  function() { expect( 
		  	app.parse(`-4 Herz`, 
		  			  'freq')[0].text).toContain("mismatched input") });

  	  it("The parser should not accept a none scalar value ",
		  function() { expect( 
		  	app.parse(`IV H`, 
		  			  'freq')[0].text).toContain("mismatched input") });
	  
	  });
	  
    });
    
    describe("range ", function() {

  	it("The parser should accept range of integers ",
		function() { expect( app.parse(`[1, 10]`, 'range')).toEqual([]) });

  	it("The parser should accept signed values in range ",
		function() { expect( app.parse(`[-23, +12]`, 'range')).toEqual([]) });

  	it("The parser should accept range of reals ",
		function() { expect( app.parse(`[-23.4e-2, 12321.21]`, 'range')).toEqual([]) });

  	it("The parser should accept range of scalar units ",
		function() { expect( app.parse(`[-23.4e-2HZ, 12321.21 GHz]`, 'range')).toEqual([]) });

  	it("The parser should accept range of versions ",
		function() { expect( app.parse(`[1.0.0.alpha-10, 5.0]`, 'range')).toEqual([]) });

  	it("The parser should accept unbounded to value range ",
		function() { expect( app.parse(`[UNBOUNDED, 12321.21 GHz]`, 'range')).toEqual([]) });
	
  	it("The parser should accept unbounded to value range ",
		function() { expect( app.parse(`[0, UNBOUNDED]`, 'range')).toEqual([]) });

  	it("The parser should accept unbounded to unbounded range ",
		function() { expect( app.parse(`[UNBOUNDED, UNBOUNDED]`, 'range')).toEqual([]) });

  	it("The parser should not accept empty list as range ",
		function() { expect( app.parse(`[ ]`, 'range')[0].text).toContain("no viable alternative at input '[]'") });

  	it("The parser should not accept list of more than 2 items as range ",
		function() { expect( app.parse(`[1, 2, 3]`, 'range')[0].text).toContain("mismatched input") });

  	it("The parser should not accept list of 1 item as range ",
		function() { expect( app.parse(`[ 1 ]`, 'range')[0].text).toContain("no viable alternative at input '[1]'") });

  	it("The parser should not accept range of none comparable values",
		function() { expect( app.parse(`[ True, False ]`, 'range')[0].text).toContain("no viable alternative at input") });

  	it("The parser should accept range of compatible types",
		function() { expect( app.parse(`[ 1.0, 3 ]`, 'range')).toEqual([]) });

  	it("The parser should not accept range of imcompatible types",
		function() { expect( app.parse(`[ 1.0.0, 3 ]`, 'range')[0].text).toContain("no viable alternative at input") });

    });

    describe("list ", function() {

    it("The parser should accept empty list ",
		function() { expect( app.parse(`[]`, 'test')).toEqual([]) });

    it("The parser should accept multiline empty list ",
		function() { expect( app.parse(`[  

]`, 'test')).toEqual([]) });
	
    it("The parser should accept list of integers in short notation ",
		function() { expect( app.parse(`[1, 2, 3, -6]`, 'test')).toEqual([]) });

    it("The parser should accept multiline list of integers in short notation ",
		function() { expect( app.parse(`[
1, 2, 
3, 
-6]`, 'test')).toEqual([]) });

    it("The parser should accept list of integer in expended notation ",
		function() { expect( app.parse(
`- 1
- 2
- 3
- -6
`, 'test')).toEqual([]) });

    it("The parser should accept expended list with one item ",
		function() { expect( app.parse(
`- tagada`, 'test')).toEqual([]) });

    it("The parser should accept expended list of short list ",
		function() { expect( app.parse(
`- [ 1, 2]
- [4,5]
`, 'test')).toEqual([]) });

    it("The parser should accept expended list of expended lists ",
		function() { expect( app.parse(
`- - 1
- - '4' 
  - '5'
`, 'test')).toEqual([]) });
	
    it("The parser should accept expended list of maps ",
		function() { expect( app.parse(
`- alain: re
- un: 1
  deux: 2
  trois: 3
- test: 7
  esszi: 9
- des: gtr
`, 'test')).toEqual([]) });

    it("The parser should accept heterogeous lists ",
		function() { expect( app.parse(
`- "dedkrofk drd cf "
- un: 1
  deux: 2
  trois: 3
- test: 7
  esszi: 9
- -23.5e4 Hz
`, 'test')).toEqual([]) });

    });

    describe("map", function() {

    it("The parser should accept empty map ",
		function() { expect( app.parse(`{}`, 'map')).toEqual([]) });

    it("The parser should accept multiline empty list ",
		function() { expect( app.parse(`{  

}`, 'test')).toEqual([]) });
	
    it("The parser should accept map in short notation ",
		function() { expect( app.parse(`{a: 1, bb: 2, v: 3, z: -6}`, 'map')).toEqual([]) });

    it("The parser should accept multiline map in short notation ",
		function() { expect( app.parse(`{ 
a:1, bb: 2, 
v: 3, 
z: -6}`, 'test')).toEqual([]) });

    it("The parser should accept map in expended notation ",
		function() { expect( app.parse(
`a: 1
b: 2
c:3
d: -6
`, 'map')).toEqual([]) });

    it("The parser should accept expended map with one item ",
		function() { expect( app.parse(
`pouet: tagada`, 'map')).toEqual([]) });

    it("The parser should accept expended map with short map and list values",
		function() { expect( app.parse(
`val1: [ 1, 2]
val2: { a: 4, fr:5}
`, 'test')).toEqual([]) });

    it("The parser should accept expended map of maps ",
		function() { expect( app.parse(
`unhy:
   alain: re
deux: 
  un: 1
  deux: 2
  trois: 3
trois:
  test: 7
  esszi: 9
quatre:
  des: gtr
`, 'test')).toEqual([]) });

    it("The parser should accept expended map of lists of map or lists etc.",
		function() { expect( app.parse(
`
un1: 
   - -  45
     -  2
     -  - 34
        - 56
     -  alors:
          - 8
        donc: dede
        si:  plouf
        il:
          - 45
          - - - 4
            - 1234
deux:
   - er
   - ygh
   - - a

`, 'test')).toEqual([]) });
	
	});
	
  });
  
});
