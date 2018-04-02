app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("imports : ", function() {

	it("The compiler should accept simple list of file paths",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2
imports:
  - custom_types/paypalpizzastore_nodejs_app.yaml
`	)).toEqual([]) });

	it("The compiler should accept a relative path",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2
imports:
  - ./../../custom_types/paypalpizzastore/nodejs.app
`	)).toEqual([]) });

	it("The compiler should accept a directory",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2
imports:
  - ./custom_types/paypalpizzastore_nodejs_app/
`	)).toEqual([]) });

	it("The compiler should accept simple uris",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2
imports:
  - file://custom_types/paypalpizzastore_nodejs_app.yaml
`	)).toEqual([]) }); 


	it("The compiler should accept list of URIs or files",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2
imports:
  - http://custom_types/paypalpizzastore_nodejs_app.html
  - ../../custom_types/paypalpizzastore_nodejs_app.html
  - custom_types/paypalpizzastore_nodejs_app/yaml
  
`	)).toEqual([]) });
	
	it("The compiler should accept example of the normative document",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2
imports:
  - some_definition_file: path1/path2/some_defs.yaml
  - another_definition_file:
      file: path1/path2/file2.yaml
      repository: my_service_catalog
      namespace_uri: http://mycompany.com/tosca/1.0/platform
      namespace_prefix: mycompany
`)).toEqual([]) });

	
	it("The compiler should not accept import without file",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2
imports:
  - some_definition_file: path1/path2/some_defs.yaml
  - another_definition_file:
      repository: my_service_catalog
      namespace_uri: http://mycompany.com/tosca/1.0/platform
      namespace_prefix: mycompany
`	)[0].text).toContain("No 'file' value provided") });
  });

});
