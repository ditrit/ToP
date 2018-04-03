app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("artifact_types : ", function() {

  	it("The compiler should accept an empty artifact_types section",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2
artifact_types:
`	)).toEqual([]) });
  		  
  		 
  	it("The compiler should accept normative tosca.artifact.Root",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

artifact_types:
  tosca.artifacts.Root:
    description: The TOSCA Artifact Type all other TOSCA Artifact Types derive from
`	)).toEqual([]) });

  	it("The compiler should accept just definition by name ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

artifact_types:
  tosca.artifacts.Root:

`	)).toEqual([]) });
  	it("The compiler should accept derivation with normative tosca.artifact.File",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2
artifact_types:
  tosca.artifacts.Root:
    description: The TOSCA Artifact Type all other TOSCA Artifact Types derive from
  tosca.artifacts.File:
    derived_from: tosca.artifacts.Root
`	)).toEqual([]) });

  	it("The compiler should accept all normative artifact types definiyion",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

artifact_types:
    tosca.artifacts.Root:
      description: The TOSCA Artifact Type all other TOSCA Artifact Types derive from
    tosca.artifacts.File:
      derived_from: tosca.artifacts.Root
    tosca.artifacts.Deployment:
      derived_from: tosca.artifacts.Root
      description: TOSCA base type for deployment artifacts
    tosca.artifacts.Deployment.Image:
      derived_from: tosca.artifacts.Deployment
    tosca.artifacts.Implementation:
      derived_from: tosca.artifacts.Root
      description: TOSCA base type for implementation artifacts
    tosca.artifacts.Implementation.Bash:
      derived_from: tosca.artifacts.Implementation
      description: Script artifact for the Unix Bash shell
      mime_type: application/x-sh
      file_ext: [ sh ]
    tosca.artifacts.Implementation.Python:
      derived_from: tosca.artifacts.Implementation
      description: Artifact for the interpreted Python language
      mime_type: application/x-python
      file_ext: [ py ]

`	)).toEqual([]) });

  	it("The compiler should not accept an artifact with bad keyname types definiyion",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

artifact_types:
    tosca.artifacts.Root:
      description: The TOSCA Artifact Type all other TOSCA Artifact Types derive from
    tosca.artifacts.File:
      derived_from: tosca.artifacts.Root
    tosca.artifacts.Deployment:
      derived_from: tosca.artifacts.Root
      description: TOSCA base type for deployment artifacts
    tosca.artifacts.Deployment.Image:
      derived_from: tosca.artifacts.Deployment
    tosca.artifacts.Implementation:
      derived_from: tosca.artifacts.Root
      description: TOSCA base type for implementation artifacts
    tosca.artifacts.Implementation.Bash:
      derived_from: tosca.artifacts.Implementation
      description: Script artifact for the Unix Bash shell
      mime_type: application/x-sh
      name: plouf
      file_ext: [ sh ]
    tosca.artifacts.Implementation.Python:
      derived_from: tosca.artifacts.Implementation
      description: Artifact for the interpreted Python language
      mime_type: application/x-python
      file_ext: [ py ]

`	)[0].text).toContain("extraneous input 'name'") });

  	it("The compiler should accept artifact with multiple file_ext",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

artifact_types:
    tosca.artifacts.Root:
      description: The TOSCA Artifact Type all other TOSCA Artifact Types derive from
    tosca.artifacts.File:
      derived_from: tosca.artifacts.Root
    tosca.artifacts.Web:
      derived_from: tosca.artifacts.Implementation
      description: Artifact for the interpreted Python language
      mime_type: application/x-python
      file_ext: [ http, https ]

`	)).toEqual([]) });

  	it("The compiler should accept artifact with file_ext in multiline list syntax",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

artifact_types:
    tosca.artifacts.Root:
      description: The TOSCA Artifact Type all other TOSCA Artifact Types derive from
    tosca.artifacts.File:
      derived_from: tosca.artifacts.Root
    tosca.artifacts.Web:
      derived_from: tosca.artifacts.Implementation
      description: Artifact for the interpreted Python language
      mime_type: application/x-python
      file_ext:
        - http
        - https

`	)).toEqual([]) });

  	it("The compiler should accept artifact with empty file_ext ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

artifact_types:
    tosca.artifacts.Root:
      description: The TOSCA Artifact Type all other TOSCA Artifact Types derive from
    tosca.artifacts.File:
      derived_from: tosca.artifacts.Root
    tosca.artifacts.Web:
      derived_from: tosca.artifacts.Implementation
      description: Artifact for the interpreted Python language
      mime_type: application/x-python
      file_ext: []
`	)).toEqual([]) });

  	it("The compiler should accept artifact with empty multiline file_ext ",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

artifact_types:
    tosca.artifacts.Root:
      description: The TOSCA Artifact Type all other TOSCA Artifact Types derive from
    tosca.artifacts.File:
      derived_from: tosca.artifacts.Root
    tosca.artifacts.Web:
      derived_from: tosca.artifacts.Implementation
      description: Artifact for the interpreted Python language
      mime_type: application/x-python
      file_ext:
`	)).toEqual([]) });

  });

});
