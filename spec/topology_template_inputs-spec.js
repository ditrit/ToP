app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("topology_template inputs : ", function() {

  		  
  	it("The compiler should accept simple example of inputs from norm. doc (p 14) ",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  inputs:
    cpus:
      type: integer
      description: Number of CPUs for the server.
      constraints:
        - valid_values: [ 1, 2, 4, 8 ]
`	)).toEqual([]) });

	
  	it("The compiler should accept more complex example of inputs from norm. doc (p 20) ",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  inputs:
  # Admin user name and password to use with the WordPress application
    wp_admin_username:
      type: string
    wp_admin_password:
      type: string
    wp_db_name:
      type: string
    wp_db_user:
      type: string
    wp_db_password:
      type: string
    wp_db_port:
      type: integer
    mysql_root_password:
      type: string
    mysql_port:
      type: integer
    context_root:
      type: string	
`	)).toEqual([]) });
	
	
  	it("The compiler should accept more complex example of inputs from norm. doc (p 277) ",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  inputs:
    cpus:
      type: integer
      description: Number of CPUs for the server.
      constraints:
        - valid_values: [ 1, 2, 4, 8 ]
    storage_size:
      type: scalar-unit.size
      default: 1 GB
      description: Size of the storage to be created.
    storage_snapshot_id:
      type: string
      description: >
        Optional identifier for an existing snapshot to use when creating storage.
    storage_location:
      type: string
      description: >
       Block storage mount point (filesystem path).
`	)).toEqual([]) });

	
  	it("The compiler should accept more complex example of inputs from norm. doc (p 297) ",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
    inputs:
      network_name:
        type: string
        description: Network name
      network_cidr:
        type: string
        default: 10.0.0.0/24
        description: CIDR for the network
      network_start_ip:
        default: 10.0.0.100
        type: string
        description: Start IP for the allocation pool
      network_end_ip:
        type: string
        default: 10.0.0.150
        description: End IP for the allocation pool
`	)).toEqual([]) });


  	it("The compiler should accept more complex example of inputs from norm. doc (p 308) ",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  inputs:
    my_cpus:
      type: integer
      description: Number of CPUs for the server.
      constraints:
        - valid_values: [ 1, 2, 4, 8 ]
      default: 1
    github_url:
      type: string
      description: The URL to download nodejs.
      default: https://github.com/sample.git
`	)).toEqual([]) });

  	it("The compiler should accept inputs with value_expressions ",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  inputs:
    server_address:
      value: { get_attribute: [ HOST, networks, private, addresses, 0 ] }
      type: string
      description: The first private IP address for the provisioned server.
    my_cpus:
      type: integer
      description: Number of CPUs for the server.
      constraints:
        - valid_values: [ 1, 2, 4, 8 ]
      default: 1
    github_url:
      type: string
      description: The URL to download nodejs.
      default: https://github.com/sample.git
`	)).toEqual([]) });
	
  	it("The compiler should not accept inputs without 'type' value",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  inputs:
    server_address:
      value: { get_attribute: [ HOST, networks, private, addresses, 0 ] }
      description: The first private IP address for the provisioned server.
    my_cpus:
      type: integer
      description: Number of CPUs for the server.
      constraints:
        - valid_values: [ 1, 2, 4, 8 ]
      default: 1
    github_url:
      type: string
      description: The URL to download nodejs.
      default: https://github.com/sample.git
`	)[0].text).toContain("No 'type' value provided") });

  });

});
