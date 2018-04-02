app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("interface_types : ", function() {

	it("The compiler should accept no interfaces definition",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

interface_types:

` )).toEqual([]) });

	it("The compiler should accept normative Root interface Definition",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

interface_types:

  tosca.interfaces.Root:
    derived_from: tosca.entity.Root
    description: The TOSCA root Interface Type all other TOSCA base Interface Types derive from

` )).toEqual([]) });

	it("The compiler should accept minimal Root interface definition (no derivation)",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

interface_types:

  tosca.interfaces.Root:

` )).toEqual([]) });

	it("The compiler should accept interface with inputs",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

interface_types:

  mycompany.mytypes.myinterfaces.MyConfigure:
    derived_from: tosca.interfaces.relationship.Root
    description: My custom configure Interface Type
    inputs:
      mode:
        type: string
` )).toEqual([]) });

	it("The compiler should accept interface type exemple from normative doc",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

interface_types:

  mycompany.mytypes.myinterfaces.MyConfigure:
    derived_from: tosca.interfaces.relationship.Root
    description: My custom configure Interface Type
    inputs:
      mode:
        type: string
    pre_configure_service:
      description: pre-configure operation for my service
    post_configure_service:
      description: post-configure operation for my service
` )).toEqual([]) });


	it("The compiler should accept normative capability types",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2
interface_types:
  
  #section: 5.8.3 tosca.interfaces.Root
  #url: http://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.1/csprd02/TOSCA-Simple-Profile-YAML-v1.1-csprd02.html#DEFN_TYPE_ITFC_NODE_ROOT
  tosca.interfaces.Root:
    derived_from: tosca.entity.Root
    description: The TOSCA root Interface Type all other TOSCA base Interface Types derive from
  
  #section: 5.8.4 tosca.interfaces.node.lifecycle.Standard
  #url: http://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.1/csprd02/TOSCA-Simple-Profile-YAML-v1.1-csprd02.html#DEFN_TYPE_ITFC_NODE_LIFECYCLE_STANDARD
  tosca.interfaces.node.lifecycle.Standard:
    derived_from: tosca.interfaces.Root
    create:
      description: Standard lifecycle create operation.
    configure:
      description: Standard lifecycle configure operation.
    start:
      description: Standard lifecycle start operation.
    stop:
      description: Standard lifecycle stop operation.
    delete:
      description: Standard lifecycle delete operation.
  
  #section: 5.8.5 tosca.interfaces.relationship.Configure
  #url: http://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.1/csprd02/TOSCA-Simple-Profile-YAML-v1.1-csprd02.html#DEFN_TYPE_ITFC_RELATIONSHIP_CONFIGURE
  tosca.interfaces.relationship.Configure:
    derived_from: tosca.interfaces.Root
    pre_configure_source:
      description: Operation to pre-configure the source endpoint.
    pre_configure_target:
      description: Operation to pre-configure the target endpoint.
    post_configure_source:
      description: Operation to post-configure the source endpoint.
    post_configure_target:
      description: Operation to post-configure the target endpoint.
    add_target:
      description: Operation to notify the source node of a target node being added via a relationship.
    add_source:
      description: Operation to notify the target node of a source node which is now available via a relationship.
    target_changed:
      description: Operation to notify source some property or attribute of the target changed
    remove_target:
      description: Operation to remove a target node.  
` )).toEqual([]) });
	
	it("The compiler should accept interface type with operation with shorthand implementation definitions",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

interface_types:

  mycompany.mytypes.myinterfaces.MyConfigure:
    derived_from: tosca.interfaces.relationship.Root
    description: My custom configure Interface Type
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
` )).toEqual([]) });

	it("The compiler should accept interface type with operation with extended implementation definitions ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

interface_types:

  mycompany.mytypes.myinterfaces.MyConfigure:
    derived_from: tosca.interfaces.relationship.Root
    description: My custom configure Interface Type
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
` )).toEqual([]) });

  });                                               

  
});