app = require("../topar.js");

describe("Tosca Compiler syntax -> ", function() {
	
  describe("repositories : ", function() {

	it("The compiler should accept an empty repositories section",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2
repositories:

` )).toEqual([]) });
  		  

	it("The compiler should accept example of the normative doc",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

repositories:
  my_code_repo:
    description: My project’s code repository in GitHub
    url: https://github.com/my-project/

` )).toEqual([]) });


	it("The compiler should accept short notation",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

repositories:
  docker_hub: https://registry.hub.docker.com/

` )).toEqual([]) });

	it("The compiler should accept empty list of repositories",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

repositories:

` )).toEqual([]) });

	it("The compiler should accept repositories with credentials",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

repositories:
  my_code_repo:
    description: My project’s code repository in GitHub
    url: https://github.com/my-project/
    credential: 
      protocol: http
      token_type: basic_auth
      # Username and password are combined into a string
      # Note: this would be base64 encoded before transmission by any impl.
      token: myusername:mypassword

` )).toEqual([]) });

	it("The compiler should reject repositories with credentials but no token provided",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

repositories:
  my_code_repo:
    description: My project’s code repository in GitHub
    url: https://github.com/my-project/
    credential: 
      protocol: http
      token_type: basic_auth
      # Username and password are combined into a string
      # Note: this would be base64 encoded before transmission by any impl.

` )[0].text).toContain("No 'token' value provided") });

	it("The compiler should accept repositories with credentials in short notation",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

repositories:
  my_code_repo:
    description: My project’s code repository in GitHub
    url: https://github.com/my-project/
    credential: {  token_type: plain, token: "myuser:mypassword", protocol: http }

` )).toEqual([]) });

	it("The compiler should accept repositories with credentials in short multiline notation",
		function() { expect( app.parse(`
tosca_definitions_version: tosca_simple_yaml_1_2

repositories:
  my_code_repo:
    description: My project’s code repository in GitHub
    url: https://github.com/my-project/
    credential: {  
      token_type: plain, token: "myuser:mypassword", 
      protocol: http }

` )).toEqual([]) });

  });                                               

});