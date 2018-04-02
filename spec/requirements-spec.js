app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("requirements definition : ", function() {

	it("The compiler should accept an empty requirements section",
		function() { expect( app.parse(`
requirements:
`, 'test_requirements' )).toEqual([]) });

	it("The compiler should accept simple notation requirements",
		function() { expect( app.parse(`
requirements:
  # Simple notation, no properties defined or augmented
  - some_req: mytypes.myrequirements.MyCapabilityTypeName
`, 'test_requirements' )).toEqual([]) });

	it("The compiler should accept full notation example",
		function() { expect( app.parse(`
requirements:
  - some_database:
      capability: EndPoint.Database
      node: Database
      relationship: ConnectsTo
`, 'test_requirements' )).toEqual([]) });

	it("The compiler should not accept requirement without capability",
		function() { expect( app.parse(`
requirements:
  - some_database:
      node: Database
      relationship: ConnectsTo
`, 'test_requirements' )[0].text).toContain("No 'capability' value provided") });

	it("The compiler should accept Root node requirements",
		function() { expect( app.parse(`
requirements:
  - dependency:
      capability: tosca.capabilities.Node
      node: tosca.nodes.Root
      relationship: tosca.relationships.DependsOn
      occurrences: [ 0, UNBOUNDED ]
`, 'test_requirements' )).toEqual([]) });

	it("The compiler should accept multiple requirements (ex of Container.Application in doc)",
		function() { expect( app.parse(`
requirements:
  - host:
      capability: tosca.capabilities.Compute
      node: tosca.nodes.Container.Runtime
      relationship: tosca.relationships.HostedOn
  - storage:
      capability: tosca.capabilities.Storage
  - network:
      capability: tosca.capabilities.EndPoint
`, 'test_requirements' )).toEqual([]) });
	
	it("The compiler should accept LoadBalancer node requirements with occurences",
		function() { expect( app.parse(`
requirements:
  - application:
      capability: tosca.capabilities.Endpoint
      relationship: tosca.relationships.RoutesTo
      occurrences: [0, UNBOUNDED]
      description: Connection to one or more load balanced applications
`, 'test_requirements' )).toEqual([]) });
  
  });                                               

});