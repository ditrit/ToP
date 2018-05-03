app = require(process.cwd() + "/topar.js");

describe("Tosca Compiler ast -> ", function() {
	
  describe("Test values : ", function() {

    describe("version : ", function() {
    	var ver_a;
    	var ver_b;
    	var ver_c;
    	var ver_d;
    	var ver_e;
    	var ver_f;


    	beforeAll(function() {
    		v_mn1 = app.parse_ast(`2.6`, 'test_versions');
    		v_mn2 = app.parse_ast(`3.0`, 'test_versions');
    		v_f1  = app.parse_ast(`3.0.12`, 'test_versions');
    		v_f2  = app.parse_ast(`3.0.12`, 'test_versions');
    		v_q1 = app.parse_ast(`3.0.12.beta`, 'test_versions');
    		v_b1 = app.parse_ast(`1.0.0.alpha-10`, 'test_versions');
    		v_b2 = app.parse_ast(`1.0.0.alpha-12`, 'test_versions');
    		v_pr = app.parse_ast(`0.4`, 'test_versions');
    		v_bad = app.parse_ast(`.4`, 'test_versions');
    	});

  		it("The parser should extract major part of version",
			function() { expect( v_mn1.major).toEqual(2) });

  		it("The parser should extract minor part of version",
			function() { expect( v_mn1.minor).toEqual(6) });

  		it("The parser should extract fix part of version",
			function() { expect( v_f1.fix).toEqual(12) }); 

  		it("The parser should extract qualifier part of version",
			function() { expect( v_q1.qualifier).toEqual("beta") }); 

		it("The parser should extract build part of version",
			function() { expect( v_b1.build).toEqual(10) });  
	
  		it("The parser should accept a pre-release version ",
			function() { expect( v_pr.isPreRelease()).toEqual(true) });

  		it("The parser should not accept a version with no major",
			function() { expect( v_bad instanceof ToscaErrors).toBe(true) });

  		it("The parser should consider equality",
  			function() { expect( v_f1.equals(v_f2)).toEqual(true) });

  		it("The parser should consider 2.6 < 3.0",
  			function() { expect( v_mn1.lessThan(v_mn2)).toEqual(true) });

  		it("The parser should consider 3.0 < 3.0.12",
  			function() { expect( v_mn2.lessThan(v_f1)).toEqual(true) });

  		it("The parser should consider 1.0.0.alpha-12 > 1.0.0.alpha-10",
  			function() { expect( v_b2.moreThan(v_b1)).toEqual(true) });

  		it("Version with qualifier is less than the same without qualifier ",
  			function() { expect( v_q1.lessThan(v_f1)).toEqual(true) });

  		it("LessOrEqual is true if Equals",
  			function() { expect( v_q1.lessOrEqual(v_q1)).toEqual(true) });

  		it("LessOrEqual is true if More",
  			function() { expect( v_mn1.lessOrEqual(v_mn2)).toEqual(true) });

  		it("MoreOrEqual is true if Equals",
  			function() { expect( v_q1.moreOrEqual(v_q1)).toEqual(true) });

  		it("MoreOrEqual is true if More",
  			function() { expect( v_f1.moreThan(v_mn2)).toEqual(true) });

    });

    describe("integer : ", function() {

  	it("The parser should accept big integer ",
		function() { expect( app.parse_ast(`123456789`, 'test_integers').value).toEqual(123456789) });

  	it("The parser should accept negative integer",
		function() { expect( app.parse_ast(`-3241`, 'test_integers').value).toEqual(-3241) }); 

  	it("The parser should accept '0o' (base 8) integer",
		function() { expect( app.parse_ast(`0o3412072`, 'test_integers').value).toEqual(922682) }); 

  	it("The parser should accept '0O' (base 8) integer",
		function() { expect( app.parse_ast(`-0O123412072`, 'test_integers').value).toEqual(-21894202) }); 

  	it("The parser should accept '0x (base 16) integer",
		function() { expect( app.parse_ast(`+0x3Fa4c1207B2`, 'test_integers').value).toEqual(4373552957362) }); 

  	it("The parser should accept 0X (base 16) as integer",
		function() { expect( app.parse_ast(`0XD123AB`, 'test_integers').value).toEqual(13706155) }); 

  	it("The parser should accept '0b (base 16) integer",
		function() { expect( app.parse_ast(`-0b111001`, 'test_integers').value).toEqual(-57) }); 

  	it("The parser should accept 0B (base 16) as integer",
		function() { expect( app.parse_ast(`0B1001`, 'test_integers').value).toEqual(9) }); 

	it("The parser should accept '+' as sign for integers",
		function() { expect( app.parse_ast(`+12`, 'test_integers').value).toEqual(12) }); 

	it("The parser should accept infinity as integer",
		function() { expect( app.parse_ast(`.inf`, 'test_integers').value).toEqual(Infinity) });  

	it("The parser should accept negative infinity as integer",
		function() { expect( app.parse_ast(`-.inf`, 'test_integers').value).toEqual(-Infinity) });  
	
  	it("The parser should accept NaN as integer ",
		function() { expect( app.parse_ast(`.NaN`, 'test_integers').value).toEqual(NaN) }); 

  	it("The parser should not accept real as integer ",
		function() { expect( app.parse_ast(`123.0`, 'test_integers') instanceof ToscaErrors).toBe(true) });

  	it("The parser should not accept boolean as integer ",
		function() { expect( app.parse_ast(`true`, 'test_integers') instanceof ToscaErrors).toBe(true) });

  	it("The parser should not accept null value as integer ",
		function() { expect( app.parse_ast(`null`, 'test_integers') instanceof ToscaErrors).toBe(true) });
    });    


    describe("real (float) : ", function() {

  	it("The parser should accept a simple float (without exponent) ",
		function() { expect( app.parse_ast(`3.4`, 'test_reals').value).toEqual(3.4) });

  	it("The parser should accept a real with exponent",
		function() { expect( app.parse_ast(`-.4e-4`, 'test_reals').value).toEqual(-.00004) }); 

  	it("The parser should accept 0 as real",
		function() { expect( app.parse_ast(`0`, 'test_reals').value).toEqual(0) }); 

  	it("The parser should accept integers as reals",
		function() { expect( app.parse_ast(`-12`, 'test_reals').value).toEqual(-12) }); 

	it("The parser should accept infinity as real",
		function() { expect( app.parse_ast(`-.inf`, 'test_reals').value).toEqual(-Infinity) });  
	
  	it("The parser should accept NaN as real ",
		function() { expect( app.parse_ast(`.NaN`, 'test_reals').value).toEqual(NaN) }); 

  	it("The parser should not accept boolean as real ",
		function() { expect( app.parse_ast(`true`, 'test_reals') instanceof ToscaErrors).toBe(true) });

  	it("The parser should not accept null value as real ",
		function() { expect( app.parse_ast(`null`, 'test_reals') instanceof ToscaErrors).toBe(true) });

    });


    describe("null : ", function() {

  	it("The parser should accept a '~' as null value ",
		function() { expect( app.parse_ast(`~`, 'null_value').value).toEqual(null) });

  	it("The parser should accept a 'null' as null value ",
		function() { expect( app.parse_ast(`null`, 'null_value').value).toEqual(null) });

  	it("The parser should accept a 'NULL' as null value ",
		function() { expect( app.parse_ast(`NULL`, 'null_value').value).toEqual(null) });

  	it("The parser should accept a 'Null' as null value ",
		function() { expect( app.parse_ast(`Null`, 'null_value').value).toEqual(null) });
	
	it("The parser should not accept 0 as null value ",
		function() { expect( app.parse_ast(`0`, 'null_value') instanceof ToscaErrors).toBe(true) });

  	it("The parser should not accept nil as null value",
		function() { expect( app.parse_ast(`nil`, 'null_value') instanceof ToscaErrors).toBe(true) });

  	it("The parser should not accept empty as null value",
		function() { expect( app.parse_ast(``, 'null_value') instanceof ToscaErrors).toBe(true) });

    });

    describe("nan (not a number) : ", function() {

  	it("The parser should accept '~' as NaN ",
		function() { expect( app.parse_ast(`.nan`, 'nan').value).toEqual(NaN) });

  	it("The parser should accept 'null' as NaN ",
		function() { expect( app.parse_ast(`.NaN`, 'nan').value).toEqual(NaN) });

  	it("The parser should accept 'NULL' as NaN ",
		function() { expect( app.parse_ast(`.NAN`, 'nan').value).toEqual(NaN) });

    });

    describe("infinity : ", function() {

  	it("The parser should accept '.inf' as infinity ",
		function() { expect( app.parse_ast(`.inf`, 'infinity').value).toEqual(Infinity) });

  	it("The parser should accept '.Inf' as infinity ",
		function() { expect( app.parse_ast(`.Inf`, 'infinity').value).toEqual(Infinity) });

  	it("The parser should accept '.INF' as infinity ",
		function() { expect( app.parse_ast(`.INF`, 'infinity').value).toEqual(Infinity) });

  	it("The parser should accept '-.inf' as infinity ",
		function() { expect( app.parse_ast(`-.inf`, 'infinity').value).toEqual(-Infinity) });

  	it("The parser should accept '-.Inf' as infinity ",
		function() { expect( app.parse_ast(`-.Inf`, 'infinity').value).toEqual(-Infinity) });

  	it("The parser should accept '-.INF' as infinity ",
		function() { expect( app.parse_ast(`-.INF`, 'infinity').value).toEqual(-Infinity) });

  	it("The parser should accept '+.inf' as infinity ",
		function() { expect( app.parse_ast(`+.inf`, 'infinity').value).toEqual(Infinity) });

  	it("The parser should accept '+.Inf' as infinity ",
		function() { expect( app.parse_ast(`+.Inf`, 'infinity').value).toEqual(Infinity) });

  	it("The parser should accept '+.INF' as infinity ",
		function() { expect( app.parse_ast(`+.INF`, 'infinity').value).toEqual(Infinity) });

    });

    describe("bool (boolean) : ", function() {

  	it("The parser should accept 'True' as bool value ",
		function() { expect( app.parse_ast(`True`, 'bool').value).toEqual(true) });

  	it("The parser should accept 'TRUE' as bool value ",
		function() { expect( app.parse_ast(`TRUE`, 'bool').value).toEqual(true) });

  	it("The parser should accept 'true' as bool value ",
		function() { expect( app.parse_ast(`true`, 'bool').value).toEqual(true) });

  	it("The parser should accept 'False' as bool value ",
		function() { expect( app.parse_ast(`False`, 'bool').value).toEqual(false) });

  	it("The parser should accept 'FALSE' as bool value ",
		function() { expect( app.parse_ast(`FALSE`, 'bool').value).toEqual(false) });

  	it("The parser should accept 'true' as bool value ",
		function() { expect( app.parse_ast(`false`, 'bool').value).toEqual(false) });

  	it("The parser should not accept '0' as bool value ",
		function() { expect( app.parse_ast(`0`, 'bool') instanceof ToscaErrors).toBe(true) });

  	it("The parser should not accept '1' as bool value ",
		function() { expect( app.parse_ast(`1`, 'bool') instanceof ToscaErrors).toBe(true) });

  	it("The parser should not accept 'T' as bool value ",
		function() { expect( app.parse_ast(`T`, 'bool') instanceof ToscaErrors).toBe(true) });

    });

    describe("timestamp : ", function() {

  	it("The parser should accept '2016-04-04-15T00:00:00Z' as timestamp",
		function() { expect( app.parse_ast(`2016-04-15T00:00:00Z`, 'test_timestamp').toString()).toEqual("2016-04-15T00:00:00Z") });

  	it("The parser should accept '2016-04-08T21:59:43.10-06:00' as timestamp ",
		function() { expect( app.parse_ast(`2016-04-08T21:59:43.10-06:00`, 'test_timestamp').toString()).toEqual("2016-04-08T21:59:43.10-06:00") });

  	it("The parser should accept dates ",
		function() { expect( app.parse_ast(`2002-12-14`, 'test_timestamp').toString()).toEqual("2002-12-14") });

  	it("The parser should accept canonical form",
		function() { expect( app.parse_ast(`2001-12-15T02:59:43.1Z`, 'test_timestamp').toString()).toEqual("2001-12-15T02:59:43.1Z") });

  	it("The parser should accept valid iso8601 form ",
		function() { expect( app.parse_ast(`2001-12-14t21:59:43.10-05:00`, 'test_timestamp').toString()).toEqual("2001-12-14t21:59:43.10-05:00") });

  	it("The parser should accept space separated form ",
		function() { expect( app.parse_ast(`2001-12-14 21:59:43.10 -5`, 'test_timestamp').toString()).toEqual("2001-12-14 21:59:43.10 -5") });

  	it("The parser should accept space separated with no time zone form ",
		function() { expect( app.parse_ast(`2001-12-15 2:59:43.10`, 'test_timestamp').toString()).toEqual("2001-12-15 2:59:43.10") });

  	it("The parser should not accept bad separators ",
		function() { expect( app.parse_ast(`2002/12/14`, 'test_timestamp') instanceof ToscaErrors).toBe(true) });

    });

    describe("short_str : ", function() {

  	it("The parser should accept simple quoted strings",
		function() { expect( app.parse_ast(`
'je suis: très "content !"'
`, 'test_short_str') instanceof ToscaErrors).toBe(false) });
    
  	it("The parser should accept double quoted strings",
		function() { expect( app.parse_ast(`
"je suis très: 'content'"
`, 'test_short_str') instanceof ToscaErrors).toBe(false) });
    
  	it("The parser should accept no quoted strings",
		function() { expect( app.parse_ast(`
je suis très 'content'
`, 'test_short_str') instanceof ToscaErrors).toBe(false) });
    
  	it("The parser should accept @ip",
		function() { expect( app.parse_ast(`
9.9.89.89
`, 'test_short_str') instanceof ToscaErrors).toBe(false) });
    
		
	});
	
    describe("multiline strings : ", function() {
    
  	it("The parser should accept simple multiline strings",
		function() { expect( app.parse_ast(
`| je suis très 
  'content'
  en fait
`, 'test_mlstr') instanceof ToscaErrors).toBe(false) });

  	it("The parser should accept multiline strings with sub indentation",
		function() { expect( app.parse_ast(
`| je suis très 
  'content'
     de tout
       cela
  en fait
`, 'test_mlstr') instanceof ToscaErrors).toBe(false) });

  	it("The parser should accept multiline strings with specifier",
		function() { expect( app.parse_ast(
`>+ je suis très 
   'content'
     de tout
       cela
   en fait
 
`, 'test_mlstr') instanceof ToscaErrors).toBe(false) });
	
	});

    describe("scalar units : ", function() {

      describe("size ", function() {

  	  it("The parser should use byte as canonical unit",
		  function() { expect( app.parse_ast(`7.2 GB`, 'test_size').canonicUnit).toEqual('B') });

  	  it("The parser should extract the size number ",
		  function() { expect( app.parse_ast(`10 GB`, 'test_size').num).toEqual(10) });

  	  it("The parser should compute the canonic value of size ",
		  function() { expect( app.parse_ast(`-10 GB`, 'test_size').value).toEqual(-10000000000) });

  	  it("The parser should respect good case for unit ",
		  function() { expect( app.parse_ast(`3.4 gIb`, 'test_size').unit).toEqual("GiB") });

  	  it("The parser should accept negative size ",
		  function() { expect( app.parse_ast(`-4 KB`, 'test_size').num).toEqual(-4) });

  	  it("The parser should not accept bad unit ",
		  function() { expect( 
		  	app.parse_ast(`-4 KiloBytes`, 
		  			  'test_size') instanceof ToscaErrors).toBe(true) });

  	  it("The parser should not accept a none scalar value ",
		  function() { expect( 
		  	app.parse_ast(`a KiB`, 
		  			  'test_size') instanceof ToscaErrors).toBe(true) });
	  
  	  it("The parser should find simple equality ",
		  function() { expect( app.parse_ast(`-4 KB`, 'test_size').equals(
		  					   app.parse_ast(`-4 KB`, 'test_size'))
		  					 ).toEqual(true) });

  	  it("The parser should find equality when using different units",
		  function() { expect( app.parse_ast(`4 MB`, 'test_size').equals(
		  					   app.parse_ast(`4000 KB`, 'test_size'))
		  					 ).toEqual(true) });

  	  it("The parser should be able to compare sizes in different units",
		  function() { expect( app.parse_ast(`1023 miB`, 'test_size').lessThan(
		  					   app.parse_ast(`1 giB`, 'test_size'))
		  					 ).toEqual(true) });

  	  it("MoreThan is true if lessThan is false",
		  function() { expect( app.parse_ast(`1 giB`, 'test_size').moreThan(
		  					   app.parse_ast(`1023 miB`, 'test_size'))
		  					 ).toEqual(true) });

  	  it("LessOrEqual is true if Equals is true",
		  function() { expect( app.parse_ast(`1024 miB`, 'test_size').lessOrEqual(
		  					   app.parse_ast(`1 giB`, 'test_size'))
		  					 ).toEqual(true) });

  	  it("LessOrEqual is true if LessThan is true",
		  function() { expect( app.parse_ast(`1023 miB`, 'test_size').lessOrEqual(
		  					   app.parse_ast(`1 giB`, 'test_size'))
		  					 ).toEqual(true) });

  	  it("MoreOrEqual is true if Equals is true",
		  function() { expect( app.parse_ast(`1024 miB`, 'test_size').moreOrEqual(
		  					   app.parse_ast(`1 giB`, 'test_size'))
		  					 ).toEqual(true) });

  	  it("MoreOrEqual is true if MoreThan is true",
		  function() { expect( app.parse_ast(`1    giB`, 'test_size').moreOrEqual(
		  					   app.parse_ast(`1023 miB`, 'test_size'))
		  					 ).toEqual(true) });

	  });



      describe("time ", function() {

  	  it("The parser should use nanoseconds as canonical unit",
		  function() { expect( app.parse_ast(`10 ms`, 'test_time').canonicUnit).toEqual('ns') });

  	  it("The parser should extract the time number ",
		  function() { expect( app.parse_ast(`10 ms`, 'test_time').num).toEqual(10) });

  	  it("The parser should compute the canonic value of size ",
		  function() { expect( app.parse_ast(`3.4 Ms`, 'test_time').value).toEqual(3400000) });

  	  it("The parser should respect good case for unit ",
		  function() { expect( app.parse_ast(`3.4 Ns`, 'test_time').unit).toEqual("ns") });

  	  it("The parser should accept negative time ",
		  function() { expect( app.parse_ast(`-4 H`, 'test_time').num).toEqual(-4) });

  	  it("The parser should not accept bad unit ",
		  function() { expect( 
		  	app.parse_ast(`-4 plouf`, 
		  			  'test_time') instanceof ToscaErrors).toBe(true) });

  	  it("The parser should not accept a none scalar value ",
		  function() { expect( 
		  	app.parse_ast(`IV H`, 
		  			  'test_time') instanceof ToscaErrors).toBe(true) });

  	  it("The parser should find simple equality ",
		  function() { expect( app.parse_ast(`-4 H`, 'test_time').equals(
		  					   app.parse_ast(`-4 h`, 'test_time'))
		  					 ).toEqual(true) });

  	  it("The parser should find equality when using different units",
		  function() { expect( app.parse_ast(`4 h`, 'test_time').equals(
		  					   app.parse_ast(`14400 S`, 'test_time'))
		  					 ).toEqual(true) });

  	  it("The parser should be able to compare sizes in different units",
		  function() { expect( app.parse_ast(`3500 s`, 'test_time').lessThan(
		  					   app.parse_ast(`1 h`, 'test_time'))
		  					 ).toEqual(true) });

  	  it("MoreThan is true if lessThan is false",
		  function() { expect( app.parse_ast(`1 d`, 'test_time').moreThan(
		  					   app.parse_ast(`14400 S`, 'test_time'))
		  					 ).toEqual(true) });

  	  it("LessOrEqual is true if Equals is true",
		  function() { expect( app.parse_ast(`60 s`, 'test_time').lessOrEqual(
		  					   app.parse_ast(`1 m`, 'test_time'))
		  					 ).toEqual(true) });

  	  it("LessOrEqual is true if LessThan is true",
		  function() { expect( app.parse_ast(`23.59 h`, 'test_time').lessOrEqual(
		  					   app.parse_ast(`1 d`, 'test_time'))
		  					 ).toEqual(true) });

  	  it("MoreOrEqual is true if Equals is true",
		  function() { expect( app.parse_ast(`3600 s`, 'test_time').moreOrEqual(
		  					   app.parse_ast(`1 h`, 'test_time'))
		  					 ).toEqual(true) });

  	  it("MoreOrEqual is true if MoreThan is true",
		  function() { expect( app.parse_ast(`1    h`, 'test_time').moreOrEqual(
		  					   app.parse_ast(`3500 s`, 'test_time'))
		  					 ).toEqual(true) });

	  
	  });

      describe("frequence ", function() {

  	  it("The parser should use herz as canonical unit",
		  function() { expect( app.parse_ast(`2.4 Ghz`, 'test_freq').canonicUnit).toEqual('Hz') });

  	  it("The parser should extract the frequence number ",
		  function() { expect( app.parse_ast(`10 MhZ`, 'test_freq').num).toEqual(10) });

  	  it("The parser should compute the canonic value of frez ",
		  function() { expect( app.parse_ast(`2.4 ghz`, 'test_freq').value).toEqual(2400000000) });

  	  it("The parser should respect good case for unit ",
		  function() { expect( app.parse_ast(`3.4 gHZ`, 'test_freq').unit).toEqual("GHz") });

  	  it("The parser should not accept bad unit ",
		  function() { expect( 
		  	app.parse_ast(`-4 Herz`, 
		  			  'test_freq') instanceof ToscaErrors).toBe(true) });

  	  it("The parser should not accept a none scalar value ",
		  function() { expect( 
		  	app.parse_ast(`IV H`, 
		  			  'test_freq') instanceof ToscaErrors).toBe(true) });

  	  it("The parser should find simple equality ",
		  function() { expect( app.parse_ast(`-4 Hz`, 'test_freq').equals(
		  					   app.parse_ast(`-4 hZ`, 'test_freq'))
		  					 ).toEqual(true) });

  	  it("The parser should find equality when using different units",
		  function() { expect( app.parse_ast(`1000 hz`, 'test_freq').equals(
		  					   app.parse_ast(`1 Khz`, 'test_freq'))
		  					 ).toEqual(true) });

  	  it("The parser should be able to compare sizes in different units",
		  function() { expect( app.parse_ast(`900 kHz`, 'test_freq').lessThan(
		  					   app.parse_ast(`1 GhZ`, 'test_freq'))
		  					 ).toEqual(true) });

  	  it("MoreThan is true if lessThan is false",
		  function() { expect( app.parse_ast(`1 GhZ`, 'test_freq').moreThan(
							   app.parse_ast(`999 Mhz`, 'test_freq'))
		  					 ).toEqual(true) });

  	  it("LessOrEqual is true if Equals is true",
		  function() { expect( app.parse_ast(`1000 khz`, 'test_freq').lessOrEqual(
		  					   app.parse_ast(`1 mhz`, 'test_freq'))
		  					 ).toEqual(true) });

  	  it("LessOrEqual is true if LessThan is true",
		  function() { expect( app.parse_ast(`900 hz`, 'test_freq').lessOrEqual(
		  					   app.parse_ast(`1 khz`, 'test_freq'))
		  					 ).toEqual(true) });

  	  it("MoreOrEqual is true if Equals is true",
		  function() { expect( app.parse_ast(`1000 mhz`, 'test_freq').moreOrEqual(
		  					   app.parse_ast(`1 ghz`, 'test_freq'))
		  					 ).toEqual(true) });

  	  it("MoreOrEqual is true if MoreThan is true",
		  function() { expect( app.parse_ast(`1    GHz`, 'test_freq').moreOrEqual(
		  					   app.parse_ast(`900 mHZ`, 'test_freq'))
		  					 ).toEqual(true) });
	  
	  });
	  
    });
    
    describe("range ", function() {

  	it("The parser should accept range of integers ",
		function() { expect( app.parse_ast(`[1, 10]`, 'range').max.value).toEqual(10) });

  	it("The parser should accept signed values in range ",
		function() { expect( app.parse_ast(`[-23, +12]`, 'range').min.value).toEqual(-23) });

  	it("The parser should accept range of reals ",
		function() { expect( app.parse_ast(`[-23.4e-2, 12321.21]`, 'range').max.value).toEqual(12321.21) });

  	it("The parser should accept range of scalar units ",
		function() { expect( app.parse_ast(`[-23.4e-2HZ, 12321.21 GHz]`, 'range').max.type).toEqual('ScalarUnitFreq') });

  	it("The parser should accept range of versions ",
		function() { expect( app.parse_ast(`[1.0.0.alpha-10, 5.0]`, 'range').max.type).toBe('Version') });

  	it("The parser should accept unbounded to value range 1",
		function() { expect( app.parse_ast(`[UNBOUNDED, 12321.21 GHz]`, 'range').min.type).toBe('Unbounded') });
	
  	it("The parser should accept unbounded to value range 2",
		function() { expect( app.parse_ast(`[0, UNBOUNDED]`, 'range').max.type).toBe('Unbounded') });

  	it("The parser should accept unbounded to unbounded range 3",
		function() { expect( app.parse_ast(`[UNBOUNDED, UNBOUNDED]`, 'range').min.type).toBe('Unbounded') });

  	it("The parser should not accept empty list as range ",
		function() { expect( app.parse_ast(`[ ]`, 'range') instanceof ToscaErrors).toBe(true) });

  	it("The parser should not accept list of more than 2 items as range ",
		function() { expect( app.parse_ast(`[1, 2, 3]`, 'range') instanceof ToscaErrors).toBe(true) });

  	it("The parser should not accept list of 1 item as range ",
		function() { expect( app.parse_ast(`[ 1 ]`, 'range') instanceof ToscaErrors).toBe(true) });

  	it("The parser should not accept range of none comparable values",
		function() { expect( app.parse_ast(`[ True, False ]`, 'range') instanceof ToscaErrors).toBe(true) });

  	it("The parser should accept range of compatible types",
		function() { expect( app.parse_ast(`[ 1.0, 3 ]`, 'range') instanceof ToscaErrors).toBe(false) });

  	it("The parser should not accept range of imcompatible types",
		function() { expect( app.parse_ast(`[ 1.0.0, 3 ]`, 'range') instanceof ToscaErrors).toBe(true) });

    });
/*
    describe("list ", function() {

    it("The parser should accept empty list ",
		function() { expect( app.parse_ast(`[]`, 'test_lists') instanceof ToscaErrors).toBe(false) });

    it("The parser should accept multiline empty list ",
		function() { expect( app.parse_ast(`[  

]`, 'test_lists') instanceof ToscaErrors).toBe(false) });
	
    it("The parser should accept list of integers in short notation ",
		function() { expect( app.parse_ast(`[1, 2, 3, -6]`, 'test_lists') instanceof ToscaErrors).toBe(false) });

    it("The parser should accept multiline list of integers in short notation ",
		function() { expect( app.parse_ast(`[
1, 2, 
3, 
-6]`, 'test_lists') instanceof ToscaErrors).toBe(false) });

    it("The parser should accept list of integer in expended notation ",
		function() { expect( app.parse_ast(
`- 1
- 2
- 3
- -6
`, 'test_lists') instanceof ToscaErrors).toBe(false) });

    it("The parser should accept expended list with one item ",
		function() { expect( app.parse_ast(
`- tagada`, 'test_lists') instanceof ToscaErrors).toBe(false) });

    it("The parser should accept expended list of short list ",
		function() { expect( app.parse_ast(
`- [ 1, 2]
- [4,5]
`, 'test_lists') instanceof ToscaErrors).toBe(false) });

    it("The parser should accept expended list of expended lists ",
		function() { expect( app.parse_ast(
`- - 1
- - '4' 
  - '5'
`, 'test_lists') instanceof ToscaErrors).toBe(false) });
	
    it("The parser should accept expended list of maps ",
		function() { expect( app.parse_ast(
`- alain: re
- un: 1
  deux: 2
  trois: 3
- test: 7
  esszi: 9
- des: gtr
`, 'test_lists') instanceof ToscaErrors).toBe(false) });

    it("The parser should accept heterogeous lists ",
		function() { expect( app.parse_ast(
`- "dedkrofk drd cf "
- un: 1
  deux: 2
  trois: 3
- test: 7
  esszi: 9
- -23.5e4 Hz
`, 'test_lists') instanceof ToscaErrors).toBe(false) });

    });

    describe("map", function() {

    it("The parser should accept empty map ",
		function() { expect( app.parse_ast(`{}`, 'map') instanceof ToscaErrors).toBe(false) });

    it("The parser should accept multiline empty map ",
		function() { expect( app.parse_ast(`{  

}`, 'test_maps') instanceof ToscaErrors).toBe(false) });
	
    it("The parser should accept map in short notation ",
		function() { expect( app.parse_ast(`{a: 1, bb: 2, v: 3, z: -6}`, 'map') instanceof ToscaErrors).toBe(false) });

    it("The parser should accept multiline map in short notation ",
		function() { expect( app.parse_ast(`{ 
a:1, bb: 2, 
v: 3, 
z: -6}`, 'test_maps') instanceof ToscaErrors).toBe(false) });

    it("The parser should accept map in expended notation ",
		function() { expect( app.parse_ast(
`a: 1
b: 2
c:3
d: -6
`, 'map') instanceof ToscaErrors).toBe(false) });

    it("The parser should accept expended map with one item ",
		function() { expect( app.parse_ast(
`pouet: tagada`, 'map') instanceof ToscaErrors).toBe(false) });

    it("The parser should accept expended map with short map and list values",
		function() { expect( app.parse_ast(
`val1: [ 1, 2]
val2: { a: 4, fr:5}
`, 'test_maps') instanceof ToscaErrors).toBe(false) });

    it("The parser should accept expended map of maps ",
		function() { expect( app.parse_ast(
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
`, 'test_maps') instanceof ToscaErrors).toBe(false) });

    it("The parser should accept expended map of lists of map or lists etc.",
		function() { expect( app.parse_ast(
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

`, 'test_maps') instanceof ToscaErrors).toBe(false) });
	
	});
i*/	
  });
  
});
