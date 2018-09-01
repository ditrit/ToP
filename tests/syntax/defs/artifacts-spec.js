basedir=process.cwd()

classes = require(basedir + '/ToscaTypes.js').classes
app = require(basedir + '/topar.js');

describe("Tosca Compiler syntax -> ", function() {
	
  describe("artifacts definitions : ", function() {

    beforeAll(function() {

      art1 = app.parse_string(`
  my_file_artifact: ../my_apps_files/operation_artifact.txt
  my_nexus_artifact: http://mon.nexus.a.moi/mon/artifact/kilebo.iso
`,'artifact_defs' );

    });


  	it("The compiler should accept simple artifacts definition",
		function() { expect( art1 instanceof classes.ToscaArtifactDefs).toEqual(true) });

    it("The compiler should extract my_nexus_artifact as a ToscaArtifactDef from simple artifacts definition",
    function() { expect( art1.ids.my_nexus_artifact instanceof classes.ToscaArtifactDef).toEqual(true) });

    it("The compiler should extract default 'file' value if not provided in simple artifact definition",
    function() { expect( art1.ids.my_nexus_artifact.type.val).toEqual("file") });

    it("The compiler should extract path object from simple artifacts definition",
    function() { expect( art1.ids.my_nexus_artifact.file.path.base).toEqual("kilebo.iso") });

    it("The compiler should extract and normalize path objects from simple artifacts definition",
    function() { expect( art1.ids.my_nexus_artifact.file.path.dir).toEqual("http:/mon.nexus.a.moi/mon/artifact") });

  	it("The compiler should reject simple artifact definition if value is not a filepath or an uri",
		function() { expect( app.parse_string(`
  my_file_artifact: 23.1
`,'artifact_defs'	)instanceof classes.ToscaArtifactDefs).toEqual(false) });

  	it("The compiler should accept an artifact definition in extended notation ",
		function() { expect( app.parse_string(`
  my_artifact:
    description: My beautiful artifact
    type: tosca.artifacts.File
    file: monfichier.doc
`,'artifact_defs'	) instanceof classes.ToscaArtifactDefs).toEqual(true) });

  	it("The compiler should not accept an artifact definition in extended notation with no type",
		function() { expect( app.parse_string(`
  my_artifact:
    description: My beautiful artifact
    file: monfichier.doc
`,'artifact_defs'	)instanceof classes.ToscaArtifactDefs).toEqual(false) });

  	it("The compiler should not accept an artifact definition in extended notation with no file",
		function() { expect( app.parse_string(`
  my_artifact:
    description: My beautiful artifact
    type: tosca.artifacts.File
`,'artifact_defs'	)instanceof classes.ToscaArtifactDefs).toEqual(false) });

  	it("The compiler should accept artifact definition with repository and deploy_path info",
		function() { expect( app.parse_string(`
  my_artifact:
    description: My beautiful artifact
    type: tosca.artifacts.File
    file: monfichier.doc
    deploy_path: /opt/mes_docs
    repository: mon_nexus_a_moi
`,'artifact_defs'	) instanceof classes.ToscaArtifactDefs).toEqual(true) });


  });

});
