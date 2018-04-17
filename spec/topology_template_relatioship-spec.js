app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("topology_template relationships : ", function() {

  	it("The compiler should accept simple example of relationship_template from norm. doc (p 123) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  relationship_templates:
    storage_attachment:
      type: AttachesTo
      properties:
        location: /my_mount_point
`	)).toEqual([]) });

  	it("The compiler should accept simple example of relationship_template from norm. doc (p 136) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  relationship_templates:

    my_connectsto_relationship:
      type: tosca.relationships.ConnectsTo
      interfaces:
        Configure:
          inputs:
            speed: { get_attribute: [ SOURCE, connect_speed ] }
`	)).toEqual([]) });


  	it("The compiler should accept simple example of relationship_template from norm. doc (p 160) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  relationship_templates:
    my_connection:
      type: ConnectsTo
      interfaces:
        Configure:
          inputs:
            targets_value: { get_property: [ TARGET, value ] }
`	)).toEqual([]) });

  	it("The compiler should accept simple example of relationship_template from norm. doc (p 268) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  relationship_templates:
  
    storage_attachesto_1:
      type: MyAttachesTo
      properties:
        location: /my_data_location

    storage_attachesto_2:
      type: MyAttachesTo
      properties:
        location: /some_other_data_location
`	)).toEqual([]) });

  	it("The compiler should accept simple example of relationship_template from norm. doc (p 270) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  relationship_templates:
    storage_attachesto_1:
      type: MyAttachesTo
      properties:
        location: /my_data_location
      interfaces:
        some_interface_name:
          some_operation_name_1: my_script_1.sh
          some_operation_name_2: my_script_2.sh
          some_operation_name_3: my_script_3.sh

    storage_attachesto_2:
      # Copy the contents of the “storage_attachesto_1” template into this new one
      copy: storage_attachesto_1
      # Then change just the value of the location property
      properties:
        location: /some_other_data_location	
`	)).toEqual([]) });

  	it("The compiler should not accept relationship_template without values for 'copy' or 'type'  ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  relationship_templates:
    storage_attachesto_1:
      properties:
        location: /my_data_location
      interfaces:
        some_interface_name:
          some_operation_name_1: my_script_1.sh
          some_operation_name_2: my_script_2.sh
          some_operation_name_3: my_script_3.sh
`	)[0].text).toContain("No 'type' or 'copy' value provided") });
	
  })

})