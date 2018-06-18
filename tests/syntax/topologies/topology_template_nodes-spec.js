app = require(process.cwd() + "/topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("topology_template nodes : ", function() {

  	it("The compiler should accept simple example of node with capability assignment from norm. doc (p 12) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:

    my_server:
      type: tosca.nodes.Compute
      capabilities:
        # Host container properties
        host:
          properties:
            # Compute properties
            num_cpus: 1
            disk_size: 10 GB
            mem_size: 4096 MB

        # Guest Operating System properties
        os:
          properties:
            # host Operating System image properties
            architecture: x86_64
            type: linux
            distribution: rhel
            version: 6.5
`	).errors).toEqual([]) });

  		  
  	it("The compiler should accept simple example of node with value expr from norm. doc (p 14) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:

    my_server:
      type: tosca.nodes.Compute
      capabilities:
        # Host container properties
        host:
          properties:
            # Compute properties
            num_cpus: { get_input: cpus }
            mem_size: 2048 MB
            disk_size: 10 GB

`	).errors).toEqual([]) });

  	it("The compiler should accept simple example of node with requirement assignment from norm. doc (p 15) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    mysql:
      type: tosca.nodes.DBMS.MySQL
      properties:
        root_password: { get_input: my_mysql_rootpw }
        port: { get_input: my_mysql_port }
      requirements:
        - host: db_server
    db_server:
      type: tosca.nodes.Compute
      capabilities:
      # omitted here for brevity
`	).errors).toEqual([]) });

  	it("The compiler should accept simple example of node with interface assignment from norm. doc (p 17) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    mysql:
      type: tosca.nodes.DBMS.MySQL
      properties:
        root_password: { get_input: my_mysql_rootpw }
        port: { get_input: my_mysql_port }
      requirements:
        - host: db_server
      interfaces:
        Standard:
          configure: scripts/my_own_configure.sh

    db_server:
      type: tosca.nodes.Compute
      capabilities:
      # omitted here for brevity
`	).errors).toEqual([]) });

  	it("The compiler should accept simple example of database content deployment from norm. doc (p 18) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    my_db:
      type: tosca.nodes.Database.MySQL
      properties:
        name: { get_input: database_name }
        user: { get_input: database_user }
        password: { get_input: database_password }
        port: { get_input: database_port }
      artifacts:
        db_content:
          file: files/my_db_content.txt
          type: tosca.artifacts.File
      requirements:
        - host: mysql
      interfaces:
        Standard:
          create:
            implementation: db_create.sh
            inputs:
              # Copy DB file artifact to server’s staging area
              db_data: { get_artifact: [ SELF, db_content ] }

    mysql:
      type: tosca.nodes.DBMS.MySQL
      properties:
        root_password: { get_input: mysql_rootpw }
        port: { get_input: mysql_port }
      requirements:
        - host: db_server
    db_server:
      type: tosca.nodes.Compute
      capabilities:
        # omitted here for brevity  
`	).errors).toEqual([]) });


  	it("The compiler should accept basic two tier application example from norm. doc (p 20) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    wordpress:
      type: tosca.nodes.WebApplication.WordPress
      properties:
        context_root: { get_input: context_root }
        admin_user: { get_input: wp_admin_username }
        admin_password: { get_input: wp_admin_password }
        db_host: { get_attribute: [ db_server, private_address ] }
      requirements:
        - host: apache
        - database_endpoint: wordpress_db
      interfaces:
        Standard:
          inputs:
            db_host: { get_attribute: [ db_server, private_address ] }
            db_port: { get_property: [ wordpress_db, port ] }
            db_name: { get_property: [ wordpress_db, name ] }
            db_user: { get_property: [ wordpress_db, user ] } 
            db_password: { get_property: [ wordpress_db, password ] }
    apache:
      type: tosca.nodes.WebServer.Apache
      properties:
        # omitted here for brevity
      requirements:
        - host: web_server
    web_server:
      type: tosca.nodes.Compute
      capabilities:
        # omitted here for brevity
    wordpress_db:
      type: tosca.nodes.Database.MySQL
      properties:
        name: { get_input: wp_db_name }
        user: { get_input: wp_db_user }
        password: { get_input: wp_db_password }
        port: { get_input: wp_db_port }
      requirements:
        - host: mysql
    mysql:
      type: tosca.nodes.DBMS.MySQL
      properties:
        root_password: { get_input: mysql_root_password }
        port: { get_input: mysql_port }
      requirements: 
        - host: db_server
    db_server:
      type: tosca.nodes.Compute
      capabilities:
        # omitted here for brevity
`	).errors).toEqual([]) });

  	it("The compiler should accept example of node with relationship in requirement def from norm. doc (p 22) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  node_templates:
    wordpress:
      type: tosca.nodes.WebApplication.WordPress
      properties:
        # omitted here for brevity
      requirements:
        - host: apache
        - database_endpoint:
            node: wordpress_db
            relationship: my_custom_database_connection

    wordpress_db:
      type: tosca.nodes.Database.MySQL
      properties:
        # omitted here for the brevity
      requirements:
        - host: mysql
`	).errors).toEqual([]) });

  	it("The compiler should accept example of node with dependency in requirement def from norm. doc (p 25) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  node_templates:
    my_app:
      type: my.types.MyApplication
      properties:
        # omitted here for brevity
      requirements:
        - dependency: some_service
    some_service:
      type: some.nodetype.SomeService
      properties:
       # omitted here for brevity
`	).errors).toEqual([]) });

  	it("The compiler should accept example of node with node_filter in requirement def from norm. doc (p 25) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  node_templates:

    mysql:
      type: tosca.nodes.DBMS.MySQL
      properties:
        # omitted here for brevity
      requirements:
        - host:
            node_filter:
              capabilities:
                # Constraints for selecting “host” (Container Capability)
                - host:
                    properties:
                      - num_cpus: { in_range: [ 1, 4 ] }
                      - mem_size: { greater_or_equal: 2 GB }# Constraints for selecting “os” (OperatingSystem Capability)
                - os:
                    properties:
                      - architecture: { equal: x86_64 }
                      - type: linux
                      - distribution: ubuntu

`	).errors).toEqual([]) });

  	it("The compiler should accept example of node with multi constraints node_filter in requirement ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  node_templates:

    mysql:
      type: tosca.nodes.DBMS.MySQL
      properties:
        # omitted here for brevity
      requirements:
        - host:
            node_filter:
              capabilities:
                # Constraints for selecting “host” (Container Capability)
                - host:
                    properties:
                      - num_cpus: { in_range: [ 1, 4 ] }
                      - mem_size: 
                          - { greater_or_equal: 2 GB } 
                          - { less_or_equal: 12 GB } 
                          - 45.5
                - os:
                    properties:
                      - architecture: { equal: x86_64 }
                      - type: linux
                      - distribution: ubuntu                          
`	).errors).toEqual([]) });

  	it("The compiler should accept example of an abstract node with requirement on a database from norm. doc (p 29) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  node_templates:

    my_app:
      type: my.types.MyApplication
      properties:
        admin_user: { get_input: admin_username }
        admin_password: { get_input: admin_password }
        db_endpoint_url: { get_property: [SELF, database_endpoint, url_path ] }
      requirements:
        - database_endpoint:
            node: my.types.nodes.MyDatabase
            node_filter:
              properties:
                - db_version: { greater_or_equal: 5.5 }
`	).errors).toEqual([]) });

  	it("The compiler should accept example of an abstract database node template from norm. doc (p 30) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  node_templates:
    my_app:
      type: my.types.MyApplication
      properties:
          admin_user: { get_input: admin_username }
          admin_password: { get_input: admin_password }
          db_endpoint_url: { get_property: [SELF, database_endpoint, url_path ] }
      requirements:
          - database_endpoint: my_abstract_database
    my_abstract_database:
      type: my.types.nodes.MyDatabase
      node_filter: # node_filter missing in normative doc
        properties:
          - db_version: { greater_or_equal: 5.5 }
`	).errors).toEqual([]) });

  	it("The compiler should accept example referencing an abstract database node template from norm. doc (p 32) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  node_templates:
    web_app:
      type: tosca.nodes.WebApplication.MyWebApp
      requirements:
        - host: web_server
        - database_endpoint: db
    web_server:
      type: tosca.nodes.WebServer
      requirements:
        - host: server
    server:
      type: tosca.nodes.Compute
        # details omitted for brevity
    db:
      # This node is abstract (no Deployment or Implementation artifacts on create)
      # and can be substituted with a topology provided by another template
      # that exports a Database type’s capabilities.
      type: tosca.nodes.Database
      properties:
        user: my_db_user
        password: secret
        name: my_db_name
`	).errors).toEqual([]) });

  	it("The compiler should accept example of substituble node templates from norm. doc (p 35) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  node_templates:
    mq:
      type: example.QueuingSubsystem
      properties:
        # properties omitted for brevity
      capabilities:
        message_queue_endpoint:
          properties: 
            limit: 100
          # details omitted for brevity limit added to allow parsing
      requirements:
        - receiver: trans1
        - receiver: trans2
    trans1:
      type: example.TransactionSubsystem
      properties:
        mq_service_ip: { get_attribute: [ mq, service_ip ] }
        receiver_port: 8080
      capabilities:
        message_receiver:
          # details omitted for brevity limit added to allow parsing
          properties: 
            limit: 100
      requirements:
        - database_endpoint: dbsys
    trans2:
      type: example.TransactionSubsystem
      properties:
        mq_service_ip: { get_attribute: [ mq, service_ip ] }
        receiver_port: 8080
      capabilities:
        message_receiver:
          properties: 
            limit: 100
          # details omitted for brevity limit added to allow parsing
      requirements:
        - database_endpoint: dbsys
    dbsys:
      type: example.DatabaseSubsystem
      properties:
        # properties omitted for brevity
      capabilities:
        database_endpoint:
          # details omitted for brevity limit added to allow parsing
          properties: 
            limit: 100
`	).errors).toEqual([]) });

  	it("The compiler should accept example of substituble node templates from norm. doc (p 41) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    wordpress_server:
      type: tosca.nodes.WebServer
      properties:
        # omitted here for brevity
      requirements:
        - host:
            # Find a Compute node that fulfills these additional filter reqs.
            node_filter:
              capabilities:
                - host:
                    properties:
                      - mem_size: { greater_or_equal: 512 MB }
                      - disk_size: { greater_or_equal: 2 GB }
                - os:
                    properties:
                      - architecture: x86_64
                      - type: linux
    mysql:
      type: tosca.nodes.DBMS.MySQL
      properties:
        # omitted here for brevity
      requirements:
        - host:
            node: tosca.nodes.Compute
            node_filter:
              capabilities:
                - host:
                    properties:
                      - disk_size: { greater_or_equal: 1 GB }
                - os:
                    properties:
                      - architecture: x86_64 
                      - type: linux	
`	).errors).toEqual([]) });

  	it("The compiler should accept inputs for all operations in node template example from norm. doc (p 44) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
	
  node_templates:
    wordpress:
      type: tosca.nodes.WebApplication.WordPress
      requirements:
        - database_endpoint: mysql_database
      interfaces:
        Standard:
          inputs:
            wp_db_port: { get_property: [ SELF, database_endpoint, port ] }
`	).errors).toEqual([]) });


  	it("The compiler should accept inputs specific to one operation in node template example from norm. doc (p 44) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    wordpress:
      type: tosca.nodes.WebApplication.WordPress
      requirements:
        - database_endpoint: mysql_database
      interfaces:
        Standard:
          create: wordpress_install.sh
          configure:
            implementation: wordpress_configure.sh
            inputs:
              wp_db_port: { get_property: [ SELF, database_endpoint, port ] }
`	).errors).toEqual([]) });

  	it("The compiler should accept setting output variables to an attribute in node template example from norm. doc (p 45) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    frontend:
      type: MyTypes.SomeNodeType
      attributes:
        url: { get_operation_output: [ SELF, Standard, create, generated_url ] }
      interfaces:
        Standard:
          create:
            implementation: scripts/frontend/create.sh
`	).errors).toEqual([]) });

  
  	it("The compiler should accept passing output variables between operations in node template example from norm. doc (p 45) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    frontend:
      type: MyTypes.SomeNodeType
      interfaces:
        Standard:
          create:
            implementation: scripts/frontend/create.sh
          configure:
            implementation: scripts/frontend/configure.sh
            inputs:
              data_dir: { get_operation_output: [ SELF, Standard, create, data_dir ] }
`	).errors).toEqual([]) });

	
  	it("The compiler should accept capability assignment in node template example from norm. doc (p 115) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    some_node_template:
      type: tosca.nodes.WebApplication    
      capabilities:
        some_capability:
          properties:
           limit: 100
`	).errors).toEqual([]) });

  	it("The compiler should accept Abstract hosting requirement on a Node Type in node template example from norm. doc (p 118) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  node_templates:
    my_application_node_template:
      type: tosca.nodes.WebApplication
      #...
      requirements:
        - host:
            node: tosca.nodes.WebServer
`	).errors).toEqual([]) });

  	it("The compiler should accept Requirement with Node Template and a custom Relationship Type in node template example from norm. doc (p 118) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  node_templates:
    # Example of a (database) requirement that is fulfilled by a node template named
    # “my_database”, but also requires a custom database connection relationship
    my_application_node_template:
      type: tosca.nodes.WebApplication
      requirements:
        - database:
            node: my_database
            capability: Endpoint.Database
            relationship: my.types.CustomDbConnection
`	).errors).toEqual([]) });

  	it("The compiler should accept Requirement for a Compute node with additional selection criteria (filter) in node template example from norm. doc (p 119) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  node_templates:
    mysql:
      type: tosca.nodes.DBMS.MySQL
      properties:
        # omitted here for brevity
      requirements:
        - host:
            node: tosca.nodes.Compute
            node_filter:
              capabilities: 
                - host:
                    properties:
                      - num_cpus: { in_range: [ 1, 4 ] }
                      - mem_size: { greater_or_equal: 512 MB }
                - os:
                    properties:
                      - architecture: { equal: x86_64 }
                      - type: { equal: linux }
                      - distribution: { equal: ubuntu }
                - mytypes.capabilities.compute.encryption:
                   properties:
                     - algorithm: { equal: aes }
                     - keylength: { valid_values: [ 128, 256 ] }
`	).errors).toEqual([]) });


  	it("The compiler should accept simple node template example from norm. doc (p 121) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  node_templates:
    mysql:
      type: tosca.nodes.DBMS.MySQL
      properties:
        root_password: { get_input: my_mysql_rootpw }
        port: { get_input: my_mysql_port }
      requirements:
        - host: db_server
      interfaces:
        Standard:
          configure: scripts/my_own_configure.sh
`	).errors).toEqual([]) });
  
  	it("The compiler should accept minimal example from norm. doc (p 135) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  node_templates:
    my_webapp_node_template:
      type: WebApplication
    my_database_node_template:
      type: Database  
`	).errors).toEqual([]) });

  	it("The compiler should accept node template example from norm. doc (p 154) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  node_templates:
    load_balancer:
      type: some.vendor.LoadBalancer
      requirements:
        - member:
            relationship: some.vendor.LoadBalancerToMember
      interfaces:
        Configure:
          add_target:
            inputs:
              member_ip: { get_attribute: [ TARGET, ip_address ] }
            implementation: scripts/configure_members.py
`	).errors).toEqual([]) })
	

  	it("The compiler should accept get_input in node template example from norm. doc (p 158) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  node_templates:
    my_server:
      type: tosca.nodes.Compute
      capabilities:
        host:
          properties:
            num_cpus: { get_input: cpus }
`	).errors).toEqual([]) })

  	it("The compiler should accept get_property in node template example from norm. doc (p 159) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  node_templates:
    mysql_database:
      type: tosca.nodes.Database
      properties:
        name: sql_database1
    wordpress:
      type: tosca.nodes.WebApplication.WordPress
      #...
      interfaces:
        Standard:
          configure:
            inputs:
              wp_db_name: { get_property: [ mysql_database, name ] }
`	).errors).toEqual([]) })

  	it("The compiler should accept get_property using SELF in node templates example from norm. doc (p 160) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
              
  node_templates:
    mysql_database:
      type: tosca.nodes.Database
      #...
      capabilities:
        database_endpoint:
          properties:
            port: 3306
    wordpress:
      type: tosca.nodes.WebApplication.WordPress
      requirements:
        #...
        - database_endpoint: mysql_database
      interfaces:
        Standard:
          create: wordpress_install.sh
          configure:
            implementation: wordpress_configure.sh
            inputs:
              #...
              wp_db_port: { get_property: [ SELF, database_endpoint, port ] }	
`	).errors).toEqual([]) })

  	it("The compiler should accept Retrieving artifact without specified location in node templates example from norm. doc (p 164) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
              
  node_templates:
    wordpress:
      type: tosca.nodes.WebApplication.WordPress
      #...
      interfaces:
        Standard:
          #Configure # error in doc
            create:
              implementation: wordpress_install.sh
              inputs:
                wp_zip: { get_artifact: [ SELF, zip ] }
      artifacts:
        zip: /data/wordpress.zip
`	).errors).toEqual([]) })

  	it("The compiler should accept Retrieving artifact as a local path in node templates example from norm. doc (p 164) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
              
  node_templates:
    wordpress:
      type: tosca.nodes.WebApplication.WordPress
      interfaces:
        Standard:
          create:
            implementation: wordpress_install.sh
            inputs:
              wp_zip: { get_artifact: [ SELF, zip, LOCAL_FILE] }
      artifacts:
        zip: /data/wordpress.zip	
`	).errors).toEqual([]) })


  	it("The compiler should accept Retrieving artifact as a specified path in node templates example from norm. doc (p 165) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
              
  node_templates:
    wordpress:
      type: tosca.nodes.WebApplication.WordPress
      interfaces:
        Standard:
          create:
            implementation: wordpress_install.sh
            inputs:
              wp_zip: { get_artifact: [ SELF, zip, C:/wpdata/wp.zip] }
      artifacts:
        zip: /data/wordpress.zip	
`	).errors).toEqual([]) })

  	it("The compiler should accept example from norm. doc (p 225) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
              
  node_templates:
    my_server:
      type: tosca.nodes.Compute
    mysql:
      type: tosca.nodes.DBMS.MySQL
      requirements:
        - host: my_server
      interfaces:
        tosca.interfaces.nodes.custom.Backup:
          # operarions # error in norm. doc
            backup: backup.sh	 # error in norm. doc
 `	).errors).toEqual([]) })

  	it("The compiler should accept example from norm. doc (p 234) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
  node_templates:
    my_server:
      type: tosca.nodes.Compute
    mysql:
      type: tosca.nodes.DBMS.MySQL
      requirements:
        - host: my_server
      interfaces:
        tosca.interfaces.nodes.custom.Backup:
          # operations: # error in norm. doc.
          backup:
            implementation: backup.sh
            inputs:
              storage_url: { get_input: storage_url }
`	).errors).toEqual([]) })

  	it("The compiler should accept Specifying a network outside the application’s Service Template example from norm. doc (p 254) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    frontend:
      type: tosca.nodes.Compute
      properties: # omitted for brevity
    backend:
      type: tosca.nodes.Compute
      properties: # omitted for brevity
    database:
      type: tosca.nodes.Compute
      properties: # omitted for brevity
    oam_network:
      type: tosca.nodes.network.Network
      properties: # omitted for brevity
    admin_network:
      type: tosca.nodes.network.Network
      properties: # omitted for brevity
    data_network:
      type: tosca.nodes.network.Network
      properties: # omitted for brevity

    # ports definition
    fe_oam_net_port:
      type: tosca.nodes.network.Port
      properties:
        is_default: true
        ip_range_start: { get_input: fe_oam_net_ip_range_start }
        ip_range_end: { get_input: fe_oam_net_ip_range_end }
      requirements:
        - link: oam_network
        - binding: frontend
    fe_admin_net_port:
      type: tosca.nodes.network.Port
      requirements:
        - link: admin_network
        - binding: frontend
    be_admin_net_port:
      type: tosca.nodes.network.Port
      properties:
        order: 0
      requirements:
        - link: admin_network
        - binding: backend
    be_data_net_port:
      type: tosca.nodes.network.Port
      properties:
        order: 1
      requirements:
        - link: data_network
        - binding: backend
    db_data_net_port:
      type: tosca.nodes.network.Port
      requirements:
        - link: data_network
        - binding: database
`	).errors).toEqual([]) })
	
  	it("The compiler should accept Specifying network requirements within the application’s Service Template example from norm. doc (p 254) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:	

    frontend:
      type: tosca.nodes.Compute
      properties: # omitted for brevity
      requirements:
        - network_oam: oam_network
        - network_admin: admin_network
    backend:
      type: tosca.nodes.Compute
      properties: # omitted for brevity
      requirements:
        - network_admin: admin_network
        - network_data: data_network
    database:
      type: tosca.nodes.Compute
      properties: # omitted for brevity
      requirements:
        - network_data: data_network
    oam_network:
      type: tosca.nodes.network.Network
      properties:
        ip_version: { get_input: oam_network_ip_version }
        cidr: { get_input: oam_network_cidr }
        start_ip: { get_input: oam_network_start_ip }
        end_ip: { get_input: oam_network_end_ip }
    admin_network:
      type: tosca.nodes.network.Network
      properties:
        ip_version: { get_input: admin_network_ip_version }
        dhcp_enabled: { get_input: admin_network_dhcp_enabled }
    data_network:
      type: tosca.nodes.network.Network
      properties: 
        ip_version: { get_input: data_network_ip_version }
        cidr: { get_input: data_network_cidr }
`	).errors).toEqual([]) })

	
  	it("The compiler should accept  example from norm. doc (p 265) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    my_web_service:
      type: MyServiceType
      #...
      requirements:
        - connection1:
            node: my_web_server
    my_web_server:
      # Note, the normative WebServer node type declares the “data_endpoint”
      # capability of type tosca.capabilities.Endpoint.
      type: WebServer
`	).errors).toEqual([]) })

  	it("The compiler should accept  example from norm. doc (p 266) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    my_server:
      type: Compute
      #...
      requirements:
        # contextually this can only be a relationship type
        - local_storage:
            # capability is provided by Compute Node Type
            node: my_block_storage
            relationship:
              type: AttachesTo
              properties:
                location: /path1/path2
            # This maps the local requirement name ‘local_storage’ to the
            # target node’s capability name ‘attachment’
                
    my_block_storage:
      type: BlockStorage
      properties:
        size: 10 GB	
`	).errors).toEqual([]) })

	
  	it("The compiler should accept  example from norm. doc (p 267) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    my_block_storage:
      type: BlockStorage
      properties:
       size: 10
    my_web_app_tier_1:
      type: Compute
      requirements:
        - local_storage:
            node: my_block_storage
            relationship: MyAttachesTo
            # use default property settings in the Relationship Type definition
    my_web_app_tier_2:
      type: Compute
      requirements:
        - local_storage:
            node: my_block_storage
            relationship:
              type: MyAttachesTo
              # Override default property setting for just the ‘location’ property
              properties:
                location: /some_other_data_location
`	).errors).toEqual([]) })
	
  	it("The compiler should accept  example from norm. doc (p 268) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    my_block_storage:
      type: BlockStorage
      properties:
        size: 10
    my_web_app_tier_1:
      type: Compute # error in doc
      requirements:
        - local_storage:
            node: my_block_storage
            relationship: storage_attachesto_1
    my_web_app_tier_2:
      type: Compute # error in doc
      requirements:
        - local_storage:
            node: my_block_storage
            relationship: storage_attachesto_2
`	).errors).toEqual([]) })


  	it("The compiler should accept  example from norm. doc (p 275) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2
description: >
  TOSCA Simple Profile with a SoftwareComponent node with a declared Virtual
  machine (VM) deployment artifact that automatically deploys to its host Compute
  node.
topology_template:
  node_templates:
    my_virtual_machine:
      type: SoftwareComponent 
      artifacts:
        my_vm_image:
          file: images/fedora-18-x86_64.qcow2
          type: tosca.artifacts.Deployment.Image.VM.QCOW2
      requirements:
        - host: my_server
      # Automatically deploy the VM image referenced on the create operation
      interfaces:
        Standard:
         create: my_vm_image
         
    # Compute instance with no Operating System guest host
    my_server:
      type: Compute
      capabilities:
        # Note: no guest OperatingSystem requirements as these are in the image.
        host:
          properties:
            disk_size: 10 GB
            num_cpus: { get_input: cpus }
            mem_size: 4 GB
`	).errors).toEqual([]) })

	
  	it("The compiler should accept  example from norm. doc (p 278) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    my_server:
      type: Compute
      capabilities:
        host:
          properties:
            disk_size: 10 GB
            num_cpus: { get_input: cpus }
            mem_size: 1 GB
        os:
          properties:
            architecture: x86_64
            type: linux
            distribution: fedora
            version: 18.0
      requirements:
        - local_storage:
            node: my_storage
            relationship:
              type: AttachesTo
              properties:
                location: { get_input: storage_location }

    my_storage:
      type: BlockStorage
      properties:
        size: { get_input: storage_size }
        snapshot_id: { get_input: storage_snapshot_id }
`	).errors).toEqual([]) })

  	it("The compiler should accept  example from norm. doc (p 282) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    my_server:
      type: Compute
      capabilities:
        host:
          properties:             
            disk_size: 10 GB
            num_cpus: { get_input: cpus }
            mem_size: 4 GB
        os:
          properties:
            architecture: x86_64
            type: Linux
            distribution: Fedora
            version: 18.0
      requirements:
        - local_storage:
            node: my_storage
            # Declare template to use with ‘relationship’ keyword
            relationship: storage_attachment

    my_storage:
      type: BlockStorage
      properties:
        size: { get_input: storage_size }
`	).errors).toEqual([]) })

  	it("The compiler should accept  example from norm. doc (p 284) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    my_web_app_tier_1:
      type: tosca.nodes.Compute
      capabilities:
        host:
          properties:
            disk_size: 10 GB
            num_cpus: { get_input: cpus }
            mem_size: 4096 MB

        os:
          properties:
            architecture: x86_64
            type: Linux
            distribution: Fedora
            version: 18.0
      requirements:
        - local_storage:
            node: my_storage
            relationship: MyAttachesTo

    my_web_app_tier_2:
      type: tosca.nodes.Compute
      capabilities:
        host:
          properties:
            disk_size: 10 GB
            num_cpus: { get_input: cpus }
            mem_size: 4096 MB
        os:
          properties:
            architecture: x86_64
            type: Linux
            distribution: Fedora
            version: 18.0
      requirements:
        - local_storage:
            node: my_storage
            relationship:
              type: MyAttachesTo
              properties:
                location: /some_other_data_location
                  
    my_storage:
      type: tosca.nodes.BlockStorage
      properties:
        size: { get_input: storage_size }
        snapshot_id: { get_input: storage_snapshot_id }
`	).errors).toEqual([]) })

  	it("The compiler should accept  example from norm. doc (p 291) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    my_server:
      type: tosca.nodes.Compute
      capabilities:
        host:
          properties:
            disk_size: 10 GB
            num_cpus: { get_input: cpus }
            mem_size: 4096 MB
        os:
          properties:
            architecture: x86_64
            type: Linux
            distribution: Fedora
            version: 18.0
      requirements:
        - local_storage:
            node: my_storage
            relationship:
              type: AttachesTo
              properties:
                location: { get_input: storage_location }

    my_storage:
      type: tosca.nodes.BlockStorage
      properties:
        size: { get_input: storage_size }
        snapshot_id: { get_input: storage_snapshot_id }

    my_server2: 
      type: tosca.nodes.Compute
      capabilities:
        host:
          properties:
            disk_size: 10 GB
            num_cpus: { get_input: cpus }
            mem_size: 4096 MB
        os:
          properties:
            architecture: x86_64
            type: Linux
            distribution: Fedora
            version: 18.0
      requirements:
        - local_storage:
            node: my_storage2
            relationship:
              type: AttachesTo
              properties:
                location: { get_input: storage_location }

    my_storage2:
      type: tosca.nodes.BlockStorage
      properties:
        size: { get_input: storage_size }
        snapshot_id: { get_input: storage_snapshot_id }
`	).errors).toEqual([]) })

  	it("The compiler should accept  example from norm. doc (p 294) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    my_server:
      type: tosca.nodes.Compute
      capabilities:
        host:
          properties:
            disk_size: 10 GB
            num_cpus: 1
            mem_size: 4096 MB
        os:
          properties:
            architecture: x86_64
            type: Linux
            distribution: CirrOS
            version: 0.3.2

    my_network:
      type: tosca.nodes.network.Network
      properties:
        network_name: { get_input: network_name }
        ip_version: 4
        cidr: '192.168.0.0/24'
        start_ip: '192.168.0.50'
        end_ip: '192.168.0.200'
        gateway_ip: '192.168.0.1'
    my_port:
      type: tosca.nodes.network.Port
      requirements:
        - binding: my_server
        - link: my_network
`	).errors).toEqual([]) })

  	it("The compiler should accept  example from norm. doc (p 296) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    my_server:
      type: tosca.nodes.Compute
      capabilities:
        host:
          properties:
            disk_size: 10 GB
            num_cpus: 1
            mem_size: 4096 MB
        os:
          properties:
            architecture: x86_64
            type: Linux
            distribution: CirrOS
            version: 0.3.2

    my_network:
      type: tosca.nodes.network.Network
      properties:
        network_name: { get_input: network_name }
    
    my_port:
      type: tosca.nodes.network.Port
      requirements:
        - binding:
            node: my_server
        - link:
            node: my_network
`	).errors).toEqual([]) })


  	it("The compiler should accept  example from norm. doc (p 298) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    my_server:
      type: tosca.nodes.Compute
      capabilities:
        host:
          properties:
            disk_size: 10 GB
            num_cpus: 1
            mem_size: 4096 MB
        os:
          properties:
            architecture: x86_64
            type: Linux
            distribution: CirrOS
            version: 0.3.2
    my_server2:
      type: tosca.nodes.Compute
      capabilities:
        host:
          properties:
            disk_size: 10 GB
            num_cpus: 1
            mem_size: 4096 MB
        os:
          properties:
            architecture: x86_64
            type: Linux
            distribution: CirrOS
            version: 0.3.2

    my_network:
      type: tosca.nodes.network.Network
      properties:
        ip_version: 4
        cidr: { get_input: network_cidr }
        network_name: { get_input: network_name }
        start_ip: { get_input: network_start_ip }
        end_ip: { get_input: network_end_ip }

    my_port:
      type: tosca.nodes.network.Port
      requirements:
        - binding: my_server
        - link: my_network

    my_port2:
      type: tosca.nodes.network.Port
      requirements:
        - binding: my_server2
        - link: my_network	
`	).errors).toEqual([]) })

  	it("The compiler should accept  example from norm. doc (p 300) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
    my_server:
      type: tosca.nodes.Compute
      capabilities:
        host:
          properties:
            disk_size: 10 GB
            num_cpus: 1
            mem_size: 4096 MB
        os:
          properties:
            architecture: x86_64
            type: Linux
            distribution: CirrOS
            version: 0.3.2

    my_network1:
      type: tosca.nodes.network.Network
      properties:
        cidr: '192.168.1.0/24'
        network_name: net1
        
    my_network2:
      type: tosca.nodes.network.Network
      properties:
        cidr: '192.168.2.0/24'
        network_name: net2
        
    my_network3:
      type: tosca.nodes.network.Network
      properties:
        cidr: '192.168.3.0/24'
        network_name: net3
        
    my_port1:
      type: tosca.nodes.network.Port
      properties:
        order: 0
      requirements:
        - binding: my_server
        - link: my_network1
        
    my_port2:
      type: tosca.nodes.network.Port
      properties:
        order: 1
      requirements:
        - binding: my_server
        - link: my_network2
        
    my_port3:
     type: tosca.nodes.network.Port
     properties:
       order: 2
     requirements:
       - binding: my_server
       - link: my_network3
`	).errors).toEqual([]) })


  	it("The compiler should accept  example from norm. doc (p 303) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:

    wordpress:
      type: tosca.nodes.WebApplication.WordPress
      properties:
        context_root: { get_input: context_root }
      requirements:
        - host: webserver
        - database_endpoint: mysql_database
      interfaces:
        Standard:
          create: wordpress_install.sh
          configure:
            implementation: wordpress_configure.sh
            inputs: 
              wp_db_name: { get_property: [ mysql_database, name ] }
              wp_db_user: { get_property: [ mysql_database, user ] }
              wp_db_password: { get_property: [ mysql_database, password ] }
              # In my own template, find requirement/capability, find port property
              wp_db_port: { get_property: [ SELF, database_endpoint, port ] }

    mysql_database:
      type: Database
      properties:
        name: { get_input: db_name }
        user: { get_input: db_user }
        password: { get_input: db_pwd }
        port: { get_input: db_port }
      capabilities:
        database_endpoint:
          properties:
            port: { get_input: db_port }
      requirements:
        - host: mysql_dbms
      interfaces:
        Standard:
          configure: mysql_database_configure.sh

    mysql_dbms:
      type: DBMS
      properties:
        root_password: { get_input: db_root_pwd }
        port: { get_input: db_port }
      requirements:
        - host: server
      interfaces:
        Standard:
          inputs:
            db_root_password: { get_property: [ mysql_dbms, root_password ] }
          create: mysql_dbms_install.sh
          start: mysql_dbms_start.sh
          configure: mysql_dbms_configure.sh

    webserver:
      type: WebServer
      requirements:
        - host: server
      interfaces:
        Standard:
          create: webserver_install.sh
          start: webserver_start.sh
          
    server:
      type: Compute
      capabilities:
        host:
          properties:
            disk_size: 10 GB
            num_cpus: { get_input: cpus }
            mem_size: 4096 MB
        os:
          properties:
            architecture: x86_64
            type: linux
            distribution: fedora
            version: 17.0
`	).errors).toEqual([]) })

	

  	it("The compiler should accept begining of example from norm. doc (p 308) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
  
    paypal_pizzastore:
      type: tosca.nodes.WebApplication.PayPalPizzaStore
      properties:
        github_url: { get_input: github_url }
      requirements: 
        - host:nodejs
        - database_connection: mongo_db
      interfaces:
        Standard:
          configure:
            implementation: scripts/nodejs/configure.sh
            inputs:
              github_url: { get_property: [ SELF, github_url ] }
              mongodb_ip: { get_attribute: [mongo_server, private_address] }
              start: scriptsscripts/nodejs/start.sh

    nodejs:
      type: tosca.nodes.WebServer.Nodejs
      requirements:
        - host: app_server
      interfaces:
        Standard:
          create: scripts/nodejs/create.sh
          
    mongo_db:
      type: tosca.nodes.Database
      requirements:
        - host: mongo_dbms
      interfaces:
        Standard:
          create: create_database.sh
          
    mongo_dbms:
      type: tosca.nodes.DBMS
      requirements:
        - host: mongo_server
      properties:
        port: 27017
      interfaces: 
        tosca.interfaces.node.lifecycle.Standard:
          create: mongodb/create.sh
          configure:
            implementation: mongodb/config.sh
            inputs:
              mongodb_ip: { get_attribute: [mongo_server, private_address] }
          start: mongodb/start.sh
`	).errors).toEqual([]) })

	
  	it("The compiler should accept begining of example from norm. doc (p 308) ",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  node_templates:
  
    # The MYSQL container based on official MySQL image in Docker hub
    mysql_container:
      type: tosca.nodes.Container.Application.Docker
      capabilities:
        # This is a capability that would mimic the Docker –link feature
        # database_link: tosca.capabilities.Docker.Link # error in norm. doc :
        # only capability assignment is allowed inside node template
      artifacts:
        my_image:
          file: mysql
          type: tosca.artifacts.Deployment.Image.Container.Docker
          repository: docker_hub
      interfaces:
        Standard:
          create:
            implementation: my_image
          inputs:
            db_root_password: { get_input: db_root_pwd }

    # The WordPress container based on official WordPress image in Docker hub
    wordpress_container:
      type: tosca.nodes.Container.Application.Docker
      requirements:
        - database_link: mysql_container
      artifacts:
        my_image:
          file: wordpress
          type: tosca.artifacts.Deployment.Image.Container.Docker
          repository: docker_hub
      interfaces:
        Standard:
          create:
            implementation: my_image
          inputs:
            host_port: { get_input: wp_host_port }	
`	).errors).toEqual([]) })

  	it("The compiler should accept begining of example from norm. doc (p 341) ",
		function() { expect( app.parse_syntax(`	
tosca_definitions_version: tosca_simple_yaml_1_0

topology_template:

  node_templates:
  
    small_ubuntu:
      type: tosca.samples.nodes.MyCloudCompute
      properties:
        image_id: ubuntu 
        flavor_id: small
      capabilities:
        host:
          properties:  # missing in norm. doc
            num_cpus: 1
            cpu_frequency: 1 GHz
            disk_size: 15 GiB
            mem_size: 2 GiB
        os:
          properties:  # missing in norm. doc
            type: linux
            distribution: ubuntu
          
    large_ubuntu:
      type: tosca.samples.nodes.MyCloudCompute
      properties:
        image_id: ubuntu
        flavor_id: small
      capabilities:
        host:
          properties:  # missing in norm. doc
            num_cpus: 4
            cpu_frequency: 2 GHz
            disk_size: 15 GiB
            mem_size: 8 GiB
        os:
          properties:  # missing in norm. doc
            type: linux
            distribution: ubuntu
          
    large_windows:
      type: tosca.samples.nodes.MyCloudCompute         
      properties:
        image_id: ubuntu
        flavor_id: small
      capabilities:
        host:
          properties:  # missing in norm. doc
            num_cpus: 4
            cpu_frequency: 2 GHz
            disk_size: 15 GiB
            mem_size: 8 GiB
        os:
          properties:  # missing in norm. doc
            type: windows
            distribution: server	
`	).errors).toEqual([]) })

	
  	it("The compiler should accept begining of example from norm. doc (p 345) ",
		function() { expect( app.parse_syntax(`	
tosca_definitions_version: tosca_simple_yaml_1_0

topology_template:

  node_templates:
    my_node:
      type: tosca.samples.nodes.MyNode
      requirements:
        - messaging:
            node: tosca.samples.nodes.MyAbstractMessagingSystem
            node_filter:
              properties:
                - scaling: { valid_values: [manual, auto] }
                - highly_available: { equal: true }
              capabilities:
                - tosca.samples.capabilities.MyMessagingEndpoint:
                    properties:
                      - throughput: { greater_than: 10 }
`	).errors).toEqual([]) })

  });

});
