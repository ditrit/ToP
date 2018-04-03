app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("artifacts : ", function() {

  	it("The compiler should accept an empty artifacts section",
		function() { expect( app.parse(`
artifacts:
`,'test_artifacts'	)).toEqual([]) });
  		  
  		 
  	it("The compiler should accept simple artifact definition",
		function() { expect( app.parse(`
artifacts:
  my_file_artifact: ../my_apps_files/operation_artifact.txt
  my_nexus_artifact: http://mon.nexus.a.moi/mon/artifact/kilebo.iso
`,'test_artifacts'	)).toEqual([]) });

  	it("The compiler should reject simple artifact definition if value is not a filepath or an uri",
		function() { expect( app.parse(`
artifacts:
  my_file_artifact: http::://../my.._apps_files/operation_artifact.txt.
`,'test_artifacts'	)[0].text).toContain("mismatched input ':'") });

  	it("The compiler should accept an artifact definition in extended notation ",
		function() { expect( app.parse(`
artifacts:
  my_artifact:
    description: My beautiful artifact
    type: tosca.artifacts.File
    file: monfichier.doc
`,'test_artifacts'	)).toEqual([]) });

  	it("The compiler should not accept an artifact definition in extended notation with no type",
		function() { expect( app.parse(`
artifacts:
  my_artifact:
    description: My beautiful artifact
    file: monfichier.doc
`,'test_artifacts'	)[0].text).toContain("No 'type' value provided") });

  	it("The compiler should not accept an artifact definition in extended notation with no file",
		function() { expect( app.parse(`
artifacts:
  my_artifact:
    description: My beautiful artifact
    type: tosca.artifacts.File
`,'test_artifacts'	)[0].text).toContain("No 'file' value provided") });

  	it("The compiler should accept artifact definition with repository and deploy_path info",
		function() { expect( app.parse(`
artifacts:
  my_artifact:
    description: My beautiful artifact
    type: tosca.artifacts.File
    file: monfichier.doc
    deploy_path: /opt/mes_docs
    repository: mon_nexus_a_moi
`,'test_artifacts'	)).toEqual([]) });


  });

});
