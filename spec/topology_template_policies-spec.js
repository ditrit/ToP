app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("topology_template policies : ", function() {

  	it("The compiler should accept simple example of policies definition from norm. doc (p 42) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  policies:
    - my_anti_collocation_policy:
        type: my.policies.anticolocateion
        targets: [ my_co_location_group ]
        # For this example, specific policy definitions are considered
        # domain specific and are not included here
`	)).toEqual([]) });

  	it("The compiler should accept simple example of policies definition from norm. doc (p 126) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  policies:
    - my_compute_placement_policy:
        type: tosca.policies.placement
        description: Apply my placement policy to my application’s servers
        targets: [ my_server_1, my_server_2 ]
        # remainder of policy definition left off for brevity
`	)).toEqual([]) });

  	it("The compiler should accept simple example of policies definition from norm. doc (p 138) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  policies: 
    - my_placement_policy:
        type: mycompany.mytypes.policy.placement
`	)).toEqual([]) });

  	it("The compiler should accept simple example of policies definition from norm. doc (p 323) ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  policies: 
    - keep_together_policy:
        type: tosca.policy.placement.Colocate
        description: Keep associated nodes (groups of nodes) based upon Compute
        properties:
          affinity: Compute
`	)).toEqual([]) });

  	it("The compiler should not accept policies definition without 'type' value ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  policies:
    - my_co_location_policy:
        properties:
          affinity: Compute
`	)[0].text).toContain("No 'type' value provided") });

  	it("The compiler should accept policy definition wirh properties p323",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

topology_template:

  policies:
    - my_scaling_policy_1:
        type: tosca.policy.scaling
        description: Simple node autoscaling
        properties:
          min_instances: 1
          max_instances: 10
          default_instances: 2
          increment: 2
`	)).toEqual([]) });


  })

})