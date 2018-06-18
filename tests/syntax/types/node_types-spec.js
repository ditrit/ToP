app = require(process.cwd() + "/topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("node types : ", function() {

	it("The compiler should accept an empty node_types section",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

node_types:
` ).errors).toEqual([]) });

	it("The compiler should accept example of the normative doc",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

node_types:

  my_company.my_types.my_app_node_type:
    derived_from: tosca.nodes.SoftwareComponent
    description: My company’s custom applicaton
    properties:
      my_app_password:
        type: string
        description: application password
        constraints:
          - min_length: 6
          - max_length: 10
    attributes:
      my_app_port:
        type: integer
        description: application port number
    requirements:
      - some_database:
          capability: EndPoint.Database
          node: Database
          relationship: ConnectsTo
` ).errors).toEqual([]) });
	
	it("The compiler should accept example 'properties reflected as attributes' p46 of the normative doc",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

node_types:

  ServerNode:
    derived_from: SoftwareComponent
    properties:
      notification_port:
        type: integer
    capabilities:
      # omitted here for brevity

  ClientNode:
    derived_from: SoftwareComponent
    properties:
      # omitted here for brevity
    requirements:
      - server:
          capability: Endpoint
          node: ServerNode
          relationship: ConnectsTo
` ).errors).toEqual([]) });

	
	it("The compiler should accept example 'Service Template A' p50 of the normative doc",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2
node_types:
  MyNode:
    derived_from: Root
    properties:
    # omitted here for brevity
    capabilities:
    # omitted here for brevity
` ).errors).toEqual([]) });

	it("The compiler should accept example 'Example' p151 of the normative doc",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2
node_types:
  my_webapp_node_type:
    derived_from: WebApplication
    properties:
      my_port:
        type: integer
  my_database_node_type:
    derived_from: Database
    capabilities: 
      transact: mytypes.myfeatures.transactSQL
` ).errors).toEqual([]) });

	it("The compiler should accept example 'Node lifecycle definition' p238 of the normative doc",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

node_types:

  tosca.nodes.Root:
    workflows:
      install:
        steps:
          install_sequence:
            activities:
              - set_state: creating
              - call_operation: tosca.interfaces.node.lifecycle.Standard.create 
              - set_state: created
              - set_state: configuring
              - call_operation: tosca.interfaces.node.lifecycle.Standard.configure
              - set_state: configured
              - set_state: starting
              - call_operation: tosca.interfaces.node.lifecycle.Standard.start
              - set_state: started
      uninstall:
        steps:
          uninstall_sequence:
            activities:
              - set_state: stopping
              - call_operation: tosca.interfaces.node.lifecycle.Standard.stop
              - set_state: stopped
              - set_state: deleting
              - call_operation: tosca.interfaces.node.lifecycle.Standard.delete
              - set_state: deleted
` ).errors).toEqual([]) });

	it("The compiler should accept example of the Network node Definition p249 of the normative doc",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

node_types:
  tosca.nodes.network.Network:
    derived_from: tosca.nodes.Root
    properties:
      ip_version:
        type: integer
        required: false
        default: 4
        constraints:
          - valid_values: [ 4, 6 ]
      cidr:
        type: string
        required: false
      start_ip:
        type: string
        required: false
      end_ip:
        type: string
        required: false
      gateway_ip:
        type: string
        required: false
      network_name:
        type: string
        required: false
      network_id:
        type: string
        required: false
      segmentation_id:
        type: string
        required: false
      network_type:
        type: string
        required: false
      physical_network:
        type: string
        required: false
    capabilities:
      link:
        type: tosca.capabilities.network.Linkable
` ).errors).toEqual([]) });

	it("The compiler should accept example of the Network node Definition p249 of the normative doc",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

node_types:

  tosca.nodes.network.Port:
    derived_from: tosca.nodes.Root
    properties:
      ip_address:
        type: string 
        required: false
      order:
        type: integer
        required: true
        default: 0
        constraints:
          - greater_or_equal: 0
      is_default:
        type: boolean
        required: false
        default: false
      ip_range_start:
        type: string
        required: false
      ip_range_end:
        type: string
        required: false
    requirements:
      - link:
          capability: tosca.capabilities.network.Linkable
          relationship: tosca.relationships.network.LinksTo
      - binding:
          capability: tosca.capabilities.network.Bindable
          relationship: tosca.relationships.network.BindsTo
` ).errors).toEqual([]) });


  });

});