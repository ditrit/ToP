basedir=process.cwd()

classes = require(basedir + '/ToscaTypes.js').classes
app = require(basedir + '/topar.js');

describe("Tosca Compiler syntax -> ", function() {
	
  describe("attributes : ", function() {

	it("The compiler should accept example of the normative doc",
		function() { expect( app.parse_string(`
  actual_cpus:
    type: integer
    description: Number of CPUs requested for a software node instance.
`, 'attributes' ) instanceof classes.ToscaAttributes).toEqual(true) });

	it("The compiler should attribute with no description",
		function() { expect( app.parse_string(`
  names:
    type: list
    entry_schema: string 
`, 'attributes' ) instanceof classes.ToscaAttributes).toEqual(true) });

	it("The compiler should accept attribute with entry_schema",
		function() { expect( app.parse_string(`
  names:
    type: list
    entry_schema: string
    description: A list of names 
`, 'attributes' ) instanceof classes.ToscaAttributes).toEqual(true) });

	it("The compiler should accept attribute with list but no entry_schema",
		function() { expect( app.parse_string(`
  names:
      type: list
      description: Actual number of CPUs allocated to the node instance """))
`, 'attributes' ) instanceof classes.ToscaAttributes).toEqual(true) });

	it("The compiler should not accept attribute with metadata",
		function() { expect( app.parse_string(`
  names:
      type: list
      description: Actual number of CPUs allocated to the node instance
      metadata: 
        un:    deux
        trois: quatre
`, 'attributes' ) instanceof classes.ToscaAttributes).toEqual(false) });
	
	it("The compiler should accept attribute with default",
		function() { expect( app.parse_string(`
  actual_cpus:
    type: integer
    default: 4
    description: Actual number of CPUs allocated to the node instance 
`, 'attributes' ) instanceof classes.ToscaAttributes).toEqual(true) });


	it("The compiler should not accept attribute with constraints",
		function() { expect( app.parse_string(`
  actual_cpus:
    type: integer
    description: Number of CPUs requested for a software node instance
    default: 1
    constraints:
      - equal: 1
`, 'attributes' ) instanceof classes.ToscaAttributes).toEqual(false) });

	it("The compiler should accept a attribute with a correct status",
		function() { expect( app.parse_string(`
  names:
    type: list
    entry_schema: string
    status: experimental
    description: A list of names 
`, 'attributes' ) instanceof classes.ToscaAttributes).toEqual(true) });

	it("The compiler should accept attribute of type 'list with constraints'",
		function() { expect( app.parse_string(`
  list1:
    type: list
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
    description: Number of CPUs requested for a software node instance
`, 'attributes' ) instanceof classes.ToscaAttributes).toEqual(true) });

	it("The compiler should accept a attribute with complex type, status and default value",
		function() { expect( app.parse_string(`
  list_of_names:
    type: list
    default:
      - tagada
      - tsointsoin
    description: A list of names
    entry_schema:
      type: string
      description: tagada
      constraints:
        - min_length: 4
        - max_length: 10
    status: experimental
`, 'attributes' ) instanceof classes.ToscaAttributes).toEqual(true) });

	it("The compiler should not accept a attribute with bad status",
		function() { expect( app.parse_string(`
  list_of_names:
      type: list
      entry_schema: string
      status: experiment
      description: A list of names
`, 'attributes' ) instanceof classes.ToscaAttributes).toEqual(false) });

	it("The compiler should accept multiple attributes",
		function() { expect( app.parse_string(`
    names:
      type: list
      entry_schema: string
      status: supported
      description: A list of names
    num_cpus:
      type: integer
      description: Actual number of CPUs allocated to the node instance
`, 'attributes' ) instanceof classes.ToscaAttributes).toEqual(true) });


	it("The compiler should accept multiple complex attributes",
		function() { expect( app.parse_string(`
    names:
      type: list
      entry_schema: string
      status: deprecated
      description: A list of names
    num_cpus:
      type: integer
      description: Number of CPUs requested for a software node instance
      default: 1
    list_int:
      type: list
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
      description: Number of CPUs requested for a software node instance
    map_string:
      description: une belle poesie
      type: map
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
`, 'attributes' ) instanceof classes.ToscaAttributes).toEqual(true) });

	it("The compiler should accept attribute with multi-level complex type and default ",
		function() { expect( app.parse_string(`
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
`, 'attributes' ) instanceof classes.ToscaAttributes).toEqual(true) });	

  });

});
