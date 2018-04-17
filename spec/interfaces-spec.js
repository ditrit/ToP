app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("interface definitions : ", function() {

	it("The compiler should accept an empty interfaces section",
		function() { expect( app.parse(`
interfaces:

`, 'test_interfaces' )).toEqual([]) });

	it("The compiler should accept simple interface Definition",
		function() { expect( app.parse(`
interfaces:

    Configure:
      type: tosca.interfaces.relationship.Configure

`, 'test_interfaces' )).toEqual([]) });


	it("The compiler should accept interface with inputs",
		function() { expect( app.parse(`
interfaces:

  MyConfigure:
    type: tosca.interfaces.relationship.Configure
    inputs:
      mode:
        type: string
`, 'test_interfaces' )).toEqual([]) });

	it("The compiler should not accept interface without type",
		function() { expect( app.parse(`
interfaces:

  MyConfigure:
    inputs:
      mode:
        type: string
`, 'test_interfaces' )[0].text).toContain("No 'type' value provided") });;

	
	it("The compiler should accept interfaces with operations",
		function() { expect( app.parse(`
interfaces:

  MyConfigure:
    type: tosca.interfaces.relationship.Configure
    inputs:
      mode:
        type: string
    pre_configure_service:
      description: pre-configure operation for my service
    post_configure_service:
      description: post-configure operation for my service
`, 'test_interfaces' )).toEqual([]) });

	
	it("The compiler should accept interface type with operation with shorthand implementation definitions",
		function() { expect( app.parse(`
interfaces:

  MyConfigure:
    type: tosca.interfaces.relationship.Configure
    inputs:
      mode:
        type: string
    pre_configure_source:
      implementation:
        primary: scripts/pre_configure_source.sh
        dependencies:
          - scripts/setup.sh
          - binaries/library.rpm
          - scripts/register.py    
`, 'test_interfaces' )).toEqual([]) });

	it("The compiler should accept interface type with operation with extended implementation definitions ",
		function() { expect( app.parse(`
interfaces:

  MyConfigure:
    type: tosca.interfaces.relationship.Configure
    inputs:
      mode:
        type: string
    pre_configure_source:
      implementation: 
        primary:
          file: scripts/pre_configure_source.sh
          type: tosca.artifacts.Implementation.Bash
          repository: my_service_catalog
        dependencies: 
          - file : scripts/setup.sh
            type : tosca.artifacts.Implementation.Bash
            repository : my_service_catalog
`, 'test_interfaces' )).toEqual([]) });

  });                                               

  
});