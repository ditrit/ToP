app = require("../topar.js");

describe("Tosca Parser syntax -> ", function() {
		
  describe("Test constraints :", function() {
	
	it("The compiler should accept simple equal constraint",
		function() { expect( app.parse(
`constraints:
  - equal: -3.4 GB
`, 'constraints' )).toEqual([]) });	

	it("The compiler should accept simple greater_than constraint",
		function() { expect( app.parse(
`constraints:
  - greater_than: -3.4
`, 'constraints' )).toEqual([]) });	

	it("The compiler should accept simple greater_or_equal constraint",
		function() { expect( app.parse(
`constraints:
  - greater_or_equal: 0
`, 'constraints' )).toEqual([]) });	

	it("The compiler should accept simple less_than constraint",
		function() { expect( app.parse(
`constraints:
  - less_than: 2
`, 'constraints' )).toEqual([]) });	

	it("The compiler should accept simple less_or_equal constraint",
		function() { expect( app.parse(
`constraints:
  - less_or_equal: 2
`, 'constraints' )).toEqual([]) });	

	it("The compiler should accept simple in_range constraint",
		function() { expect( app.parse(
`constraints:
  - in_range: [2, 6]
`, 'constraints' )).toEqual([]) });	

	it("The compiler should accept complex in_range constraint",
		function() { expect( app.parse(
`constraints:
  - in_range: [ UNBOUNDED, 45.56 MHz ]
`, 'constraints' )).toEqual([]) });	

	it("The compiler should not accept in_range constraint with not range value",
		function() { expect( app.parse(
`constraints:
  - in_range: 3
`, 'constraints' )[0].text).toContain("mismatched input '3'") });	

	it("The compiler should not accept none existing constraint",
		function() { expect( app.parse(
`constraints:
  - more_than: 21 
`, 'constraints' )[0].text).toContain("mismatched input") });
	
	it("The compiler should accept complex constraints",
		function() { expect( app.parse(
`constraints:
  - equal: -5 GB
  - equal: ez -5 GB
  - greater_than: -5.6
  - valid_values: [ 5, 6, 45] 
  - in_range: [ UNBOUNDED, -23.4e3 s ]
`, 'constraints' )).toEqual([]) });
	
  });

});
