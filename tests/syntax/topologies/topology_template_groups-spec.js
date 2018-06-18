app = require(process.cwd() + "/topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("topology_template groups : ", function() {

  	it("The compiler should accept simple example of groups definition from norm. doc (p 124) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  groups:

    my_app_placement_group:
      type: tosca.groups.Root
      description: My application’s logical component grouping for placement
      members: [ my_web_server, my_sql_database ]
`	).errors).toEqual([]) });

  	it("The compiler should accept simple example of groups definition from norm. doc (p 137) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  groups:
    # server2 and server3 are part of the same group
    server_group_1:
      type: tosca.groups.Root
      members: [ server2, server3 ]
`	).errors).toEqual([]) });

  	it("The compiler should accept simple example of groups definition from norm. doc (p 41) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  groups: 
    webserver_group: 
      type: tosca.groups.Root 
      members: [ apache, server ]
`	).errors).toEqual([]) });

  	it("The compiler should accept simple example of groups definition from norm. doc (p 42) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  groups:
    my_co_location_group:
      type: tosca.groups.Root
      members: [ wordpress_server, mysql ]
`	).errors).toEqual([]) });

  	it("The compiler should not accept groups definition without 'type' value ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  groups:
    my_co_location_group:
      members: [ wordpress_server, mysql ]
`	).errors[0].text).toContain("No 'type' value provided") });

  	it("The compiler should accept group definition wirh properties",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  groups:
    my_co_location_group:
      type: tosca.groups.Root
      properties:
        arg:
          type: integer
          default: 1
          constraints:
            - less_than: 10
      members: [ wordpress_server, mysql ]
`	).errors).toEqual([]) });

  	it("The compiler should accept group definition with metadata",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  groups:
    my_co_location_group:
      type: tosca.groups.Root
      metadata:
        policy1: standard
        group_type: colocation
      members: [ wordpress_server, mysql ]
`	).errors).toEqual([]) });

  	it("The compiler should accept group definition wirh interface definition",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  groups:
    my_co_location_group:
      type: tosca.groups.Root
      interfaces:
        Configure:
           inputs:
             arg: 45
           ope1:
             implementation: test.py
             inputs: 
               arg_ope1: tagada
      members: [ wordpress_server, mysql ]
`	).errors).toEqual([]) });

  })

})