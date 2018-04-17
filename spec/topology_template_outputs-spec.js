app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("topology_template outputs : ", function() {

  		  
  	it("The compiler should accept simple example of outputs from norm. doc (p 14) ",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  outputs:
    cpus:
      type: integer
      description: Number of CPUs for the server.
      constraints:
        - valid_values: [ 1, 2, 4, 8 ]
`	)).toEqual([]) });

	
  	it("The compiler should accept more complex example of outputs from norm. doc (p 20) ",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  outputs:
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
	
	
  	it("The compiler should accept more complex example of outputs from norm. doc (p 277) ",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  outputs:
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

	
  	it("The compiler should accept more complex example of outputs from norm. doc (p 297) ",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
    outputs:
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


  	it("The compiler should accept more complex example of outputs from norm. doc (p 308) ",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  outputs:
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

  	it("The compiler should accept outputs with value_expressions ",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  outputs:
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
	
  	it("The compiler should accept outputs without 'type' value",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  outputs:
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
`	)).toEqual([]) });

  	it("The compiler should accept outputs example p156 of norm. doc.",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  outputs:
    server_url:
      description: Concatenate the URL for a server from other template values
      value: { concat: [ 'http://',
                         get_attribute: [ server, public_address ],
                         ':',
                         get_attribute: [ server, port ] ] }	
`	)).toEqual([]) });

	
  	it("The compiler should accept outputs example p157 of norm. doc.",
		function() { expect( app.parse(
`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  outputs:
    example1:
      # Result: prefix_1111_suffix
      value: { join: [ ["prefix", 1111, "suffix" ], "_" ] }
    example2:
      # Result: 9.12.1.10,9.12.1.20
      value: { join: [ { get_input: my_IPs }, “,” ] }
`	)).toEqual([]) });
      
  });

});
