app = require("../topar.js");

describe("tosca compiler", function() {
		
	it("The compiler should accept correct tosca_definition_version",
		function() {
			expect( app.parse("test/tosca_definition_version.yaml").length).toBe(0);
			})

	it("The compiler should accept simple metadata",
		function() {
			expect( app.parse("test/metadata_simple.yaml").length).toBe(0);
			})

	it("The compiler should accept metadata with additional keys",
		function() {
			expect( app.parse("test/metadata_otherkeys.yaml").length).toBe(0);
			})

	it("The compiler should reject metadata with duplicated keys",
		function() {
			expect( app.parse("test/metadata_duplicate.yaml")[0].text ).toContain("duplicated");
			})
	});

