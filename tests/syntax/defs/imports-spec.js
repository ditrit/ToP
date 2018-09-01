basedir=process.cwd()

classes = require(basedir + '/ToscaTypes.js').classes
app = require(basedir + '/topar.js');

describe("Tosca Compiler syntax -> ", function() {
	
  describe("imports : ", function() {

    beforeAll(function() {
      import1 = app.parse_string(`
        - some_definition_file: path1/path2/some_defs.yaml
        - another_definition_file:
            file: path1/path2/file2.yaml
            repository: my_service_catalog
            namespace_uri: http://mycompany.com/tosca/1.0/platform
            namespace_prefix: mycompany
      `, 'imports'  );
    });
  
  	it("The compiler should accept simple list of file paths",
  	 	function() { expect( app.parse_string(`
      - custom_types/paypalpizzastore_nodejs_app.yaml
    `,   'imports') instanceof classes.ToscaImports ).toEqual(true) });
  
  	it("The compiler should accept a relative path",
  	 	function() { expect( app.parse_string(`
      - ./../../custom_types/paypalpizzastore/nodejs.app
    `,   'imports'	) instanceof classes.ToscaImports ).toEqual(true) });
  
  	it("The compiler should accept a directory",
  	 	function() { expect( app.parse_string(`
      - ./custom_types/paypalpizzastore_nodejs_app/
    `,   'imports'	) instanceof classes.ToscaImports ).toEqual(true) });
  
  	it("The compiler should accept simple uris",
  	 	function() { expect( app.parse_string(`
      - file://custom_types/paypalpizzastore_nodejs_app.yaml
    `,   'imports'	) instanceof classes.ToscaImports ).toEqual(true) });
  
  
  	it("The compiler should accept list of URIs or files",
  	 	function() { expect( app.parse_string(`
      - http://custom_types/paypalpizzastore_nodejs_app.html
      - ../../custom_types/paypalpizzastore_nodejs_app.html
      - custom_types/paypalpizzastore_nodejs_app/yaml
      
    `,   'imports'	) instanceof classes.ToscaImports ).toEqual(true) });
  	 
  	it("The compiler should accept example of the normative document",
  	 	function() { expect( import1 instanceof classes.ToscaImports ).toEqual(true) });
  
    it("The compiler should extract file info",
        function() { 
          expect( import1.items[1].file.val).toEqual("path1/path2/file2.yaml") });
  
    it("The compiler should extract namespace_prefix info",
        function() { 
          expect( import1.items[1].namespace_prefix.val).toEqual("mycompany") });
  	 
  	it("The compiler should not accept import without file",
  	 	function() { expect( app.parse_string(` 
       - some_definition_file: path1/path2/some_defs.yaml
       - another_definition_file:
           repository: my_service_catalog
           namespace_uri: http://mycompany.com/tosca/1.0/platform
           namespace_prefix: mycompany
    ` ,   'imports'	) instanceof classes.ToscaImports ).toEqual(false) });
  
  });
  
})  ;
  