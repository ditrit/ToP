app = require(process.cwd() + "/topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("datatypes : ", function() {

	it("The compiler should accept an empty data_types section",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

data_types:
` ).errors).toEqual([]) });

	it("The compiler should accept example of the normative doc",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

data_types:

  mytypes.phonenumber:
    description: my phone number datatype
    properties:
      countrycode:
        type: integer
      areacode:
        type: integer
        required: false
      number:
        type: integer

  mytypes.phonenumber.extended:
    derived_from: mytypes.phonenumber
    description: custom phone number type that extends the basic phonenumber type
    properties:
      phone_description:
        type: string
        constraints:
          - max_length: 128

  mytypes.phonenumber.extended.alot:
    derived_from: mytypes.phonenumber.extended
    description: custom phone number type that extends the basic phonenumber type
    properties:
      areacode:
        type: integer
        required: true
` ).errors).toEqual([]) });


	it("The compiler should accept normative datatypes definition",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2
data_types:
  tosca.datatypes.Root:
    description: The TOSCA root Data Type all other TOSCA base Data Types derive from

  tosca.datatypes.Credential:
    derived_from: tosca.datatypes.Root
    properties:
      protocol:
        type: string
        required: false
      token_type:
        type: string
        default: password
      token:
        type: string
      keys:
        required: false
        type: map
        entry_schema:
          type: string
      user:
        type: string
        required: false

  tosca.datatypes.TimeInterval:
    derived_from: tosca.datatypes.Root
    properties:
      start_time:
        type: timestamp
        required: true
      end_time:
        type: timestamp
        required: true

  tosca.datatypes.NetworkInfo:
    derived_from: tosca.datatypes.Root
    properties:
      network_name:
        type: string
      network_id:
        type: string
      addresses:
        type: list
        entry_schema:
          type: string

  tosca.datatypes.network.PortInfo:
    derived_from: tosca.datatypes.Root
    properties:
      port_name:
        type: string
      port_id:
        type: string
      network_id:
        type: string
      mac_address:
        type: string
      addresses:
        type: list
        entry_schema:
          type: string

  tosca.datatypes.network.PortDef:
    derived_from: integer
    constraints:
      - in_range: [ 1, 65535 ]

  tosca.datatypes.network.PortSpec:
    derived_from: tosca.datatypes.Root
    properties:
      protocol:
        type: string
        required: true
        default: tcp
        constraints:
          - valid_values: [ udp, tcp, igmp ]
      target:
        type: PortDef
        required: false
      target_range:
        type: range
        required: false
        constraints:
          - in_range: [ 1, 65535 ]
      source:
        type: PortDef
        required: false
      source_range:
        type: range
        required: false
        constraints:
          - in_range: [ 1, 65535 ]
` ).errors).toEqual([]) });




	it("The compiler should accept a normative datatype derivation",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

data_types:
  ditrit.datatypes.SshKey:
    derived_from: Credential
    properties:
      protocol:
        type: string
        default: ssh
        constraints:
          - valid_values:
              - ssh
      token_type:
        type: string
        default: identifier
        constraints:
          - valid_values:
              - identifier
      token:
        type: string
        required: true
` ).errors).toEqual([]) });

	it("The compiler should accept a datatype derivation from root",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

data_types:
  ditrit.datatypes.RemoteSsh:
    derived_from: tosca.datatypes.Root
    properties:
      sshkey:
        type: SshKey
        required: false
      address:
        type: string
        required: true
      user:
        type: string
        required: true
      port:
        type: PortDef
        default: 22
` ).errors).toEqual([]) });
	

  });

});
