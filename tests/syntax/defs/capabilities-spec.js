app = require(process.cwd() + "/topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("capabilities definition : ", function() {

	it("The compiler should accept an empty capabilities section",
		function() { expect( app.parse_syntax(`
capabilities:
`, 'test_capabilities' ).errors).toEqual([]) });

	it("The compiler should accept simple notation capabilities",
		function() { expect( app.parse_syntax(`
capabilities:
  # Simple notation, no properties defined or augmented
  some_capability: mytypes.mycapabilities.MyCapabilityTypeName
`, 'test_capabilities' ).errors).toEqual([]) });

	it("The compiler should accept full notation example",
		function() { expect( app.parse_syntax(`
capabilities:
  some_capability:
    type: mytypes.mycapabilities.MyCapabilityTypeName
    properties:
      limit:
        type: integer
        default: 100
`, 'test_capabilities' ).errors).toEqual([]) });

	it("The compiler should not accept capability without type",
		function() { expect( app.parse_syntax(`
capabilities:
  some_capability:
    description:|
        no type defined
        for this capability !
    properties:
      limit:
        type: integer
        default: 100
`, 'test_capabilities' ).errors[0].text).toContain("No 'type' value provided") });

	it("The compiler should accept Root node capabilities",
		function() { expect( app.parse_syntax(`
capabilities:
  feature:
    type: tosca.capabilities.Node
`, 'test_capabilities' ).errors).toEqual([]) });

	it("The compiler should accept Abstract Compute node capabilities",
		function() { expect( app.parse_syntax(`
capabilities:
  host:
    type: tosca.capabilities.Compute
    valid_source_types: []
`, 'test_capabilities' ).errors).toEqual([]) });

	it("The compiler should accept Compute node capabilities",
		function() { expect( app.parse_syntax(`
capabilities:
  host:
    type: tosca.capabilities.Compute
    valid_source_types: [tosca.nodes.SoftwareComponent]
  endpoint:
    type: tosca.capabilities.Endpoint.Admin
  os:
    type: tosca.capabilities.OperatingSystem
  scalable:
    type: tosca.capabilities.Scalable
  binding:
    type: tosca.capabilities.network.Bindable
`, 'test_capabilities' ).errors).toEqual([]) });

	
	it("The compiler should accept LoadBalancer node capabilities with occurences",
		function() { expect( app.parse_syntax(`
capabilities:
  client:
    type: tosca.capabilities.Endpoint.Public
    occurrences: [0, UNBOUNDED]
    description: the Floating (IP) client’s on the public network can connect to
`, 'test_capabilities' ).errors).toEqual([]) });
  
  });                                               

});