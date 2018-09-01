basedir=process.cwd()

classes = require(basedir + '/ToscaTypes.js').classes
app = require(basedir + '/topar.js');

describe("Tosca Compiler syntax -> ", function() {
	
  describe("capabilities definition : ", function() {

    beforeAll(function() {
  
      capadef1 = app.parse_string(`
          client:
            type: tosca.capabilities.Endpoint.Public
            occurrences: [0, UNBOUNDED]
            description: the Floating (IP) client’s on the public network can connect to
        `, 'capability_defs' )

    });

  	it("The compiler should accept simple notation capabilities",
  		function() { expect( app.parse_string(`
    some_capability: mytypes.mycapabilities.MyCapabilityTypeName
  `, 'capability_defs' ) instanceof classes.ToscaCapabilityDefs).toEqual(true) });
  
  	it("The compiler should accept full notation example",
  		function() { expect( app.parse_string(`
    some_capability:
      type: mytypes.mycapabilities.MyCapabilityTypeName
      properties:
        limit:
          type: integer
          default: 100
  `, 'capability_defs' ) instanceof classes.ToscaCapabilityDefs).toEqual(true) });
  
  	it("The compiler should not accept capability without type",
  		function() { expect( app.parse_string(`
    some_capability:
      description:|
          no type defined
          for this capability !
      properties:
        limit:
          type: integer
          default: 100
  `, 'capability_defs' ) instanceof classes.ToscaCapabilityDefs).toEqual(false) });
  
  	it("The compiler should accept Root node capabilities",
  		function() { expect( app.parse_string(`
    feature:
      type: tosca.capabilities.Node
  `, 'capability_defs' ) instanceof classes.ToscaCapabilityDefs).toEqual(true) });
  
  	it("The compiler should accept Abstract Compute node capabilities",
  		function() { expect( app.parse_string(`
    host:
      type: tosca.capabilities.Compute
      valid_source_types: []
  `, 'capability_defs' ) instanceof classes.ToscaCapabilityDefs).toEqual(true) });
  
  	it("The compiler should accept Compute node capabilities",
  		function() { expect( app.parse_string(`
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
  `, 'capability_defs' ) instanceof classes.ToscaCapabilityDefs).toEqual(true) });

    	
  	it("The compiler should accept LoadBalancer node capabilities with occurences",
  		function() { expect( 
        capadef1 instanceof classes.ToscaCapabilityDefs).toEqual(true) });

    it("The compiler should extract capability definition",
      function() { expect( 
        capadef1.ids.client instanceof classes.ToscaCapabilityDef).toEqual(true) });

    it("The compiler should extract occurences from capability definitions",
      function() { expect( 
        capadef1.ids.client.occurrences instanceof classes.ToscaRange).toEqual(true) });

    it("The compiler should extract occurences.min from capability definition",
      function() { expect( 
        capadef1.ids.client.occurrences.min.val).toEqual(0) });

    it("The compiler should extract occurences.max from capability definition",
      function() { expect( 
        capadef1.ids.client.occurrences.max instanceof classes.ToscaUnbounded).toEqual(true) });
  
    it("The compiler should extract type from capability definition",
      function() { expect( 
        capadef1.ids.client.type.val ).toEqual("tosca.capabilities.Endpoint.Public") });

  });                                               
  
}); 