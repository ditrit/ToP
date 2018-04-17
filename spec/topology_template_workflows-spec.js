app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("topology_template workflows : ", function() {

  	it("The compiler should accept simple example of workflows definition from norm. doc (p 223) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  workflows:
    deploy:
      description: Workflow to deploy the application
      steps: 
        A:
          on_success:
            - B
            - C
        B:
          on_success:
            - D
        C:
          on_success:
            - D
        D:
        E:
          on_success:
            - C
            - F
        F:
`	)).toEqual([]) });

  	it("The compiler should accept simple example of workflows definition from norm. doc (p 224) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  workflows:
    my_workflow:
      steps:
        create_my_node:
          target: my_node
          activities:
            - set_state: creating
            - call_operation: tosca.interfaces.node.lifecycle.Standard.create
            - set_state: created
`	)).toEqual([]) });

  	it("The compiler should accept simple example of workflows definition from norm. doc (p 224) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  workflows:
    my_workflow:
      steps:
        creating_my_node:
          target: my_node
          activities: 
            - set_state: creating
          on_success: create_my_node
        create_my_node:
          target: my_node
          activities:
            - call_operation: tosca.interfaces.node.lifecycle.Standard.create
          on_success: created_my_node
        created_my_node:
          target: my_node
          activities:
            - set_state: created
`	)).toEqual([]) });

  	it("The compiler should accept simple example of workflows definition from norm. doc (p 224) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  workflows:
    backup:
      description: Performs a snapshot of the MySQL data.
      steps:
        my_step:
          target: mysql
          activities:
            - call_operation: tosca.interfaces.nodes.custom.Backup.backup
`	)).toEqual([]) });


  	it("The compiler should accept simple example of workflows definition from norm. doc (p 227) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  workflows:
    deploy:
      description: Override the TOSCA declarative workflow with the following.
      steps:
        compute_install:
          target: my_server
          activities:
            - delegate: deploy
          on_success:
            - mysql_install
            - tomcat_install
        tomcat_install:
          target: tomcat
          activities:
            - set_state: creating
            - call_operation: tosca.interfaces.node.lifecycle.Standard.create
            - set_state: created
          on_success:
            - tomcat_starting
        mysql_install:
          target: mysql
          activities:
            - set_state: creating
            - call_operation: tosca.interfaces.node.lifecycle.Standard.create
            - set_state: created
            - set_state: starting
            - call_operation: tosca.interfaces.node.lifecycle.Standard.start
            - set_state: started
          on_success:
            - tomcat_starting
        tomcat_starting:
          target: tomcat
          activities:
            - set_state: starting
            - call_operation: tosca.interfaces.node.lifecycle.Standard.start
            - set_state: started	
`	)).toEqual([]) });

  	it("The compiler should accept simple example of workflows definition from norm. doc (p 229) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  workflows:
    backup:
      description: Performs a snapshot of the MySQL data.
      preconditions:
        - target: my_server
          condition:
            - assert:
                - state: [{equal: available}]
        - target: mysql
          condition:
            - assert:
                - state: [{valid_values: [started, available]}]
                - my_attribute: [{equal: ready }]
      steps:
        my_step:
          target: mysql
          activities:
            - call_operation: tosca.interfaces.nodes.custom.Backup.backup
`	)).toEqual([]) });

  	it("The compiler should accept simple example of workflows definition from norm. doc (p 230) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  workflows:
    start_mysql:
      steps:
        start_mysql:
          target: mysql
          activities:
            - set_state: starting
            - call_operation: tosca.interfaces.node.lifecycle.Standard.start
            - set_state: started
    stop_mysql:
      steps:
        stop_mysql:
          target: mysql
          activities:
            - set_state: stopping
            - call_operation: tosca.interfaces.node.lifecycle.Standard.stop
            - set_state: stopped
    backup:
      description: Performs a snapshot of the MySQL data.
      preconditions: 
        - target: my_server
          condition:
            - assert:
                - state: [{equal: available}]
        - target: mysql
          condition:
            - assert:
                - state: [{valid_values: [started, available]}]
`	)).toEqual([]) });

  	it("The compiler should accept simple example of workflows definition from norm. doc (p 231) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  workflows:
    inlined_wf:
      steps:
        A:
          target: node_a
          activities:
            - call_operation: a
          on_success:
            - B
            - C
        B:
          target: node_a
          activities:
            - call_operation: b
          on_success:
            - D
        C:
          target: node_a
          activities:
            - call_operation: c
          on_success:
            - D
        D:
          target: node_a
          activities:
            - call_operation: d
        E:
          target: node_a
          activities:
            - call_operation: e
          on_success:
            - C
            - F
        F:
          target: node_a
          activities:
            - call_operation: f
    main_workflow:
      steps:
        G:
          target: node_a
          activities:
            - set_state: initial
            - inline: inlined_wf
            - set_state: initial       # 'available' in doc (error) 
`	)).toEqual([]) });
	
  	it("The compiler should accept simple example of workflows definition from norm. doc (p 235) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  workflows:
    backup:
      description: Performs a snapshot of the MySQL data.
      preconditions:
        - target: my_server
          condition:
            - assert:
                - state: [{valid_values: [initial]}]
        - target: mysql
          condition:
            - assert:
                - state: [{valid_values: [started, initial]}]
          #attributes:             # error in doc : not alowed in grammar
          #  my_attribute: [ready] # error in doc : not alowed in grammar
      inputs:
        storage_url:
          type: string
      steps:
        my_step:
          target: mysql
          activities:
            - call_operation: tosca.interfaces.nodes.custom.Backup.backup
          # error in doc : valid_states: [initial] # [started, available] in doc (error)
          # error in doc : valid_states: [started, initial] # [started, available] in doc (error)
`	)).toEqual([]) });

  	it("The compiler should accept simple example of workflows definition from norm. doc (p 236) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:
	
  workflows:
    backup:
      steps:
        backup_step:
          target: mysql
          activities:
            - set_state: backing_up # this state is not a TOSCA known state
            - call_operation: tosca.interfaces.nodes.custom.Backup.backup
            - set_state: available # this state is known by TOSCA orchestrator
          on_failure:
            - rollback_step
        rollback_step:
          target: mysql
          activities:
            - call_operation: tosca.interfaces.nodes.custom.Backup.backup
            - set_state: available # this state is known by TOSCA orchestrator
`	)).toEqual([]) });

  })

})