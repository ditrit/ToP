app = require(process.cwd() + "/topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("relationshiptypes : ", function() {

	it("The compiler should accept an empty relationship_types section",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

relationship_types:
` ).errors).toEqual([]) });

	it("The compiler should accept example of the normative doc",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

relationship_types:

  mycompanytypes.myrelationships.AppDependency:
    derived_from: tosca.relationships.DependsOn
    valid_target_types: [ mycompanytypes.mycapabilities.SomeAppCapability ]

` ).errors).toEqual([]) });
	
	it("The compiler should accept valid_target_types with NEWLINES",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

relationship_types:

  mycompanytypes.myrelationships.AppDependency:
    derived_from: tosca.relationships.DependsOn
    valid_target_types: [ 
    	 mycompanytypes.mycapabilities.SomeAppCapability 
      ]

` ).errors).toEqual([]) });
	
	it("The compiler should accept valid_target_types in extended yaml form",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

relationship_types:

  mycompanytypes.myrelationships.AppDependency:
    derived_from: tosca.relationships.DependsOn
    valid_target_types: 
      - mycompanytypes.mycapabilities.SomeAppCapability

` ).errors).toEqual([]) });
	
	it("The compiler should accept example 'Relationship lifecylce and weaving' p239 of the normative doc",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

relationship_types:

  tosca.relationships.ConnectsTo:
    workflows: # error in doc with keyword 'workflow' 
      install: # name of the workflow for wich the weaving has to be taken in account
        source_weaving: # Instruct how to weave some tasks on the source workflow (executed on SOURCE instance)
          - after: configuring # instruct that this operation should be weaved after the target reach configuring state
            wait_target: created # add a join from a state of the target
            activity: tosca.interfaces.relationships.Configure.pre_configure_source
          - before: configured # instruct that this operation should be weaved before the target reach configured state
            activity: tosca.interfaces.relationships.Configure.post_configure_source
          - before: starting
            wait_target: started # add a join from a state of the target
          - after: started
            activity: tosca.interfaces.relationships.Configure.add_target
        target_weaving: # Instruct how to weave some tasks on the target workflow (executed on TARGET instance)
          - after: configuring # instruct that this operation should be weaved after the target reach configuring state
            after_source: created # add a join from a state of the source
            activity: tosca.interfaces.relationships.Configure.pre_configure_target
          - before: configured # instruct that this operation should be weaved before the target reach configured state
            activity: tosca.interfaces.relationships.Configure.post_configure_target
          - after: started
            activity: tosca.interfaces.relationships.Configure.add_source
` ).errors).toEqual([]) });


	it("The compiler should accept LinksTo 'Definition' p252 of the normative doc",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

relationship_types:
  tosca.relationships.network.LinksTo:
    derived_from: tosca.relationships.DependsOn
    valid_target_types: [ tosca.capabilities.network.Linkable ]
` ).errors).toEqual([]) });

	it("The compiler should accept BindsTo 'Definition' p252 of the normative doc",
		function() { expect( app.parse_syntax(`
tosca_definitions_version: tosca_simple_yaml_1_2

relationship_types:
  tosca.relationships.network.BindsTo:
    derived_from: tosca.relationships.DependsOn
    valid_target_types: [ tosca.capabilities.network.Bindable ]
` ).errors).toEqual([]) });

  });
  

});