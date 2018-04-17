app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("topology_template substitution_mappings : ", function() {

  	it("The compiler should accept simple example of substitution_mappings definition from norm. doc (p 34) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  substitution_mappings:
    node_type: tosca.nodes.Database
      capabilities:
        database_endpoint: [ database, database_endpoint ]
`	)).toEqual([]) });

  	it("The compiler should accept simple example of substitution_mappings definition from norm. doc (p 346) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  substitution_mappings:
    node_type: tosca.samples.nodes.MyAbstractMessagingSystem
      properties:
        scaling: [ scaling_input ]
        highly_available: true
      capabilities:
        messaging : [ my_load_balancer, load_balanced_messaging_endpoint]
`	)).toEqual([]) });

  	it("The compiler should accept simple example of substitution_mappings definition from norm. doc (p 39) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  substitution_mappings:
    node_type: example.TransactionSubsystem
      capabilities:
        message_receiver: [ app, message_receiver ]
      requirements:
        database_endpoint: [ app, database ]
`	)).toEqual([]) });



  })

})