app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("properties : ", function() {

	it("The compiler should accept example of the normative doc",
		function() { expect( app.parse(`
properties:
  num_cpus:
    type: integer
    description: Number of CPUs requested for a software node instance.
    default: 1
    required: true
    constraints:
      - valid_values: [ 1, 2, 4, 8 ]
`, 'test' )).toEqual([]) });

	it("The compiler should property with no description",
		function() { expect( app.parse(`
properties:
  names:
    type: list
    entry_schema: string 
`, 'test' )).toEqual([]) });

	it("The compiler should accept property with entry_schema",
		function() { expect( app.parse(`
properties:
  names:
    type: list
    entry_schema: string
    required: false
    description: A list of names 
`, 'test' )).toEqual([]) });

	it("The compiler should accept property with list but no entry_schema",
		function() { expect( app.parse(`
properties:
  names:
      type: list
      description: Actual number of CPUs allocated to the node instance """))
`, 'test' )).toEqual([]) });

	
	it("The compiler should accept property with default",
		function() { expect( app.parse(`
properties:
  actual_cpus:
    type: integer
    default: 4
    description: Actual number of CPUs allocated to the node instance 
`, 'test' )).toEqual([]) });


	it("The compiler should accept property with constraints",
		function() { expect( app.parse(`
properties:
  actual_cpus:
    type: integer
    description: Number of CPUs requested for a software node instance
    default: 1
    required: true
    constraints:
      - valid_values: [1,2,4,8]
`, 'test' )).toEqual([]) });

	it("The compiler should accept a property with a correct status",
		function() { expect( app.parse(`
properties:
  names:
    type: list
    entry_schema: string
    status: experimental
    description: A list of names 
`, 'test' )).toEqual([]) });

	it("The compiler should accept property of type list with constraints",
		function() { expect( app.parse(`
properties:
  list1:
    type: list
    constraints:
      - min_length: 2
    entry_schema:
      type: integer
      description: tagada
      constraints:
        - less_than: 5
        - in_range: [2,10]
    status: experimental
    default:
      - 2
      - 3
      - 4
    required: true
    description: Number of CPUs requested for a software node instance
`, 'test' )).toEqual([]) });

	it("The compiler should accept a property with complex type, status, default value and constraint",
		function() { expect( app.parse(`
properties:
  list_of_names:
    type: list
    default:
      - tagada
      - tsointsoin
    constraints:
      - length: 2
    description: A list of names
    entry_schema:
      type: string
      description: tagada
      constraints:
        - min_length: 4
        - max_length: 10
    status: experimental
`, 'test' )).toEqual([]) });

	it("The compiler should not accept a property with bad status",
		function() { expect( app.parse(`
properties:
  list_of_names:
      type: list
      entry_schema: string
      status: experiment
      description: A list of names
`, 'test' )[0].text).toContain("failed predicate") });

	it("The compiler should accept multiple properties",
		function() { expect( app.parse(`
properties:
    names:
      type: list
      entry_schema: string
      status: supported
      description: A list of names
      required: true
    num_cpus:
      type: integer
      description: Actual number of CPUs allocated to the node instance
`, 'test' )).toEqual([]) });


	it("The compiler should accept multiple complex properties",
		function() { expect( app.parse(`
properties:
    names:
      type: list
      entry_schema: string
      status: deprecated
      description: A list of names
      required: true
    num_cpus:
      type: integer
      description: Number of CPUs requested for a software node instance
      default: 1
      required: true
      constraints:
        - valid_values: [1,2,4,8]
    list_int:
      type: list
      constraints:
        - min_length: 2
      entry_schema:
        type: integer
        description: tagada
        constraints:
          - less_than: 5
          - in_range: [2,10]
      status: experimental
      default:
        - 2
        - 3
        - 4
      required: true
      description: Number of CPUs requested for a software node instance
    map_string:
      description: une belle poesie
      type: map
      constraints:
        - min_length: 2
      entry_schema:
        type: string
        description: tagada
        constraints:
          - min_length: 3
          - max_length: 10
      default:
        un: tagada
        deux: pouet
        trois: pouet
        quatre: tsointsoin
      required: true
`, 'test' )).toEqual([]) });

	it("The compiler should accept property with multi-level complex type and default ",
		function() { expect( app.parse(`
properties:
  complexcollection:
    type: list
    entry_schema:
      type: map
      constraints:
        - min_length: 1
        - max_length: 3
      entry_schema:
        type: list
        entry_schema: string
        description: A list of names
    default:
      - equipe1:
          - alain.terrieur
          - alex.terrieur
        activites:
          - dev
          - ops
        locaux:
          - batimentA
      - bureaux:
          - a droite
          - en bas
        personnes:
          - lea.sambe
`, 'test' )).toEqual([]) });

  });

});
